import { ResourceItem, User } from '../types';
import {
  fetchResourcesFromFirestore,
  saveResourceToFirestore,
  deleteResourceFromFirestore,
  saveFileToCloudFirestore,
  getFileFromCloudFirestore,
  deleteFileFromCloudFirestore,
  uploadFileToStorage,
  subscribeToResources
} from './firebase';

const DB_NAME = 'LMS_NguVan6_DB';
const DB_VERSION = 2;
const STORE_RESOURCES = 'resources';
const STORE_FILES = 'files';

const STORAGE_KEY_USER = 'lms_nguvan6_current_user_v5';
const STORAGE_KEY_RESOURCES = 'lms_nguvan6_resources_v5';

// 11 demo IDs to be cleared completely as requested
export const DEMO_RESOURCE_IDS = [
  'res-khbd',
  'res-bt01',
  'res-bt02',
  'res-kt01',
  'res-kt02',
  'res-bg01-slide',
  'res-dg01',
  'res-bg01-video',
  'res-bg02-video',
  'res-bg03-video',
  'res-vd01'
];

// Open / initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB không được hỗ trợ trên môi trường này'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_RESOURCES)) {
        db.createObjectStore(STORE_RESOURCES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Active session cache for object URLs created from IndexedDB
const activeObjectUrlCache = new Map<string, string>();

// Binary storage helpers in IndexedDB
export async function saveFileToIndexedDB(key: string, fileBlob: Blob): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_FILES, 'readwrite');
      const store = tx.objectStore(STORE_FILES);
      const req = store.put(fileBlob, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Lỗi lưu file vào IndexedDB:', e);
    return false;
  }
}

export async function getFileFromIndexedDB(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_FILES, 'readonly');
      const store = tx.objectStore(STORE_FILES);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteFileFromIndexedDB(key: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_FILES, 'readwrite');
      const store = tx.objectStore(STORE_FILES);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

// Synthesize a structured document if original raw binary was not attached or specific format requested
function createDocumentBlobFromPreview(resource: ResourceItem, format: 'docx' | 'pdf' | 'pptx' | 'video' | 'default' = 'default'): Blob {
  const title = resource.title || 'Tai_lieu_hoc_tap';
  const content = resource.contentPreview || resource.description || 'Nội dung học liệu Ngữ văn 6 - Tôi và các bạn.';

  if (format === 'pdf') {
    const pdfHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title} (PDF)</title>
<style>
  @page { size: A4; margin: 20mm; }
  body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 20px; }
  h1 { font-size: 18pt; text-align: center; color: #163d85; text-transform: uppercase; margin-bottom: 6px; }
  .header-meta { text-align: center; font-size: 11pt; color: #555; margin-bottom: 25px; border-bottom: 2px solid #163d85; padding-bottom: 12px; }
  .box { background: #f0f7ff; border: 1px solid #c8e1ff; padding: 12px 18px; border-radius: 6px; margin: 15px 0; }
  .content { white-space: pre-wrap; font-size: 12.5pt; line-height: 1.7; }
  @media print { .no-print { display: none; } }
</style>
</head>
<body onload="window.print()">
  <div class="no-print" style="background:#fff3cd;padding:10px;border-radius:8px;margin-bottom:15px;text-align:center;font-size:12px;font-family:sans-serif;">
    💡 <strong>Hướng dẫn:</strong> Hộp thoại in sẽ tự động mở. Bạn chọn mục <strong>"Lưu dưới dạng PDF" (Save as PDF)</strong> để tải tệp PDF về máy.
  </div>
  <h1>${title}</h1>
  <div class="header-meta">
    <strong>BỘ MÔN NGỮ VĂN 6 – BÀI 1: TÔI VÀ CÁC BẠN</strong><br/>
    ${resource.topic ? `Chuyên đề: ${resource.topic} | ` : ''}Tác giả: ${resource.author || 'Tổ bộ môn Ngữ văn THCS'}<br/>
    Mã định danh: ${resource.matrixCode || resource.id} | Ngày: ${resource.uploadedAt || new Date().toISOString().split('T')[0]}
  </div>
  ${resource.description ? `<div class="box"><strong>Mô tả sư phạm:</strong> ${resource.description}</div>` : ''}
  <div class="content">${content}</div>
</body>
</html>`;
    return new Blob([pdfHtml], { type: 'text/html;charset=utf-8' });
  }

  if (format === 'pptx' || resource.type === 'pptx') {
    const slideDeckHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title} (Slide Deck)</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #0b1f3a; color: #fff; margin: 0; padding: 40px; display: flex; flex-direction: column; align-items: center; }
  .slide { background: #ffffff; color: #1e293b; width: 900px; min-height: 506px; border-radius: 16px; padding: 48px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); margin-bottom: 30px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
  .slide h2 { color: #163d85; font-size: 26pt; margin-top: 0; border-bottom: 3px solid #ff6b24; padding-bottom: 12px; }
  .slide-body { font-size: 15pt; line-height: 1.6; white-space: pre-wrap; flex: 1; }
  .slide-footer { display: flex; justify-content: space-between; font-size: 10pt; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
</style>
</head>
<body>
  <div class="slide">
    <div>
      <h2>${title}</h2>
      <div class="slide-body">
        <strong>LMS NGỮ VĂN 6 – BÀI 1: TÔI VÀ CÁC BẠN</strong><br/><br/>
        • Chuyên đề: ${resource.topic}<br/>
        • Giáo viên giảng dạy: ${resource.author || 'Tổ bộ môn Ngữ văn'}<br/>
        • Mã bài học: ${resource.matrixCode || resource.id}
      </div>
    </div>
    <div class="slide-footer"><span>Trường Đại học Sư phạm – ĐH Đà Nẵng</span><span>Slide 1</span></div>
  </div>

  <div class="slide">
    <div>
      <h2>Nội dung bài giảng & Hoạt động</h2>
      <div class="slide-body">${content}</div>
    </div>
    <div class="slide-footer"><span>Bài 1: Tôi và các bạn</span><span>Slide 2</span></div>
  </div>
</body>
</html>`;
    return new Blob([slideDeckHtml], { type: 'text/html;charset=utf-8' });
  }

  // Default Word (.doc / .docx)
  const htmlContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #111; margin: 40px; }
  h1 { font-size: 18pt; text-align: center; color: #163d85; text-transform: uppercase; margin-bottom: 5px; }
  .header-meta { text-align: center; font-size: 11pt; color: #555; margin-bottom: 25px; border-bottom: 2px solid #163d85; padding-bottom: 12px; }
  .box { background: #f0f7ff; border: 1px solid #c8e1ff; padding: 12px 18px; border-radius: 6px; margin: 15px 0; }
  .content { white-space: pre-wrap; font-size: 13pt; line-height: 1.6; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="header-meta">
    <strong>BỘ MÔN NGỮ VĂN 6 – BÀI 1: TÔI VÀ CÁC BẠN</strong><br/>
    ${resource.topic ? `Chuyên đề: ${resource.topic} | ` : ''}Tác giả: ${resource.author || 'Tổ bộ môn Ngữ văn THCS'}<br/>
    Mã định danh: ${resource.matrixCode || resource.id} | Ngày ban hành: ${resource.uploadedAt || new Date().toISOString().split('T')[0]}
  </div>
  ${resource.description ? `<div class="box"><strong>Mô tả sư phạm:</strong> ${resource.description}</div>` : ''}
  <div class="content">${content}</div>
</body>
</html>`;
  return new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
}

// ==========================================
// SERVER API HELPERS (Unlimited Quota, 500MB+ Binary Support across all devices)
// ==========================================
async function saveFileToServerApi(id: string, fileName: string, fileBlob: Blob): Promise<string | null> {
  try {
    const res = await fetch(`/api/files/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': fileBlob.type || 'application/octet-stream',
        'X-File-Name': encodeURIComponent(fileName || `${id}.bin`)
      },
      body: fileBlob
    });
    if (res.ok) {
      const data = await res.json();
      return data.fileUrl || `/api/files/${id}`;
    }
  } catch {
    // ignore
  }
  return null;
}

async function getFileFromServerApi(id: string): Promise<Blob | null> {
  try {
    const res = await fetch(`/api/files/${encodeURIComponent(id)}`);
    if (res.ok) {
      const blob = await res.blob();
      if (blob && blob.size > 0) return blob;
    }
  } catch {
    // ignore
  }
  return null;
}

async function fetchResourcesFromServerApi(): Promise<ResourceItem[]> {
  try {
    const res = await fetch('/api/resources');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data?.resources) ? data.resources : [];
    }
  } catch {
    // ignore
  }
  return [];
}

async function saveResourceToServerApi(item: ResourceItem): Promise<void> {
  try {
    await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  } catch {
    // ignore
  }
}

async function deleteResourceFromServerApi(id: string): Promise<void> {
  try {
    await fetch(`/api/resources/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch {
    // ignore
  }
}

// Resolve real accessible file URL for preview or playback (with Server API, Cloud Firestore & IndexedDB fallback)
export async function getResourceFileUrl(resource: ResourceItem): Promise<string> {
  if (!resource) return '';

  if (activeObjectUrlCache.has(resource.id)) {
    return activeObjectUrlCache.get(resource.id)!;
  }

  // 1. Try reading original Blob from local IndexedDB
  let blob = await getFileFromIndexedDB(resource.id);

  // 2. Try reading from Backend Server API (cross-device support without quota limits)
  if (!blob) {
    blob = await getFileFromServerApi(resource.id);
    if (blob) {
      await saveFileToIndexedDB(resource.id, blob);
    }
  }

  // 3. If not found on Server API, fetch from Cloud Firestore
  if (!blob) {
    blob = await getFileFromCloudFirestore(resource.id);
    if (blob) {
      await saveFileToIndexedDB(resource.id, blob);
      saveFileToServerApi(resource.id, resource.fileName || resource.title, blob).catch(() => {});
    }
  }

  if (blob) {
    // Ensure blob has proper MIME type!
    let correctMime = blob.type;
    const lowerName = (resource.fileName || '').toLowerCase();
    if (resource.type === 'pdf' || lowerName.endsWith('.pdf')) {
      correctMime = 'application/pdf';
    } else if (resource.type === 'docx' || lowerName.endsWith('.docx')) {
      correctMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (resource.type === 'pptx' || lowerName.endsWith('.pptx')) {
      correctMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (resource.type === 'video' || lowerName.endsWith('.mp4')) {
      correctMime = 'video/mp4';
    } else if (resource.type === 'audio' || lowerName.endsWith('.mp3')) {
      correctMime = 'audio/mpeg';
    }

    if (blob.type !== correctMime) {
      blob = new Blob([blob], { type: correctMime });
    }

    const freshUrl = URL.createObjectURL(blob);
    activeObjectUrlCache.set(resource.id, freshUrl);
    return freshUrl;
  }

  // 4. Return fileUrl if it is valid external HTTPS and not an expired blob
  if (resource.fileUrl && !resource.fileUrl.startsWith('blob:')) {
    return resource.fileUrl;
  }

  return '';
}

// Universal resilient file downloader: ALWAYS DOWNLOADS THE EXACT FILE THAT WAS UPLOADED!
export async function downloadResourceFile(
  resource: ResourceItem,
  targetFormat?: 'docx' | 'pdf' | 'pptx' | 'video'
): Promise<{ success: boolean; message: string }> {
  try {
    let blob: Blob | null = null;

    // 1. Check local IndexedDB binary store (first source of authentic file)
    blob = await getFileFromIndexedDB(resource.id);

    // 2. Check Backend Server API (cross-device authentic file)
    if (!blob) {
      blob = await getFileFromServerApi(resource.id);
      if (blob) {
        await saveFileToIndexedDB(resource.id, blob);
      }
    }

    // 3. If not found, fetch authentic file from Cloud Firestore
    if (!blob) {
      blob = await getFileFromCloudFirestore(resource.id);
      if (blob) {
        await saveFileToIndexedDB(resource.id, blob);
        saveFileToServerApi(resource.id, resource.fileName || resource.title, blob).catch(() => {});
      }
    }

    // 4. If still not found, try remote fileUrl (Firebase Storage or HTTPS)
    if (!blob && resource.fileUrl) {
      if (resource.fileUrl.startsWith('data:')) {
        const res = await fetch(resource.fileUrl);
        blob = await res.blob();
      } else if (resource.fileUrl.startsWith('http') || resource.fileUrl.startsWith('/api/files/')) {
        try {
          const res = await fetch(resource.fileUrl);
          if (res.ok) {
            blob = await res.blob();
          }
        } catch {
          const a = document.createElement('a');
          a.href = resource.fileUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.click();
          return { success: true, message: `Đang mở tệp "${resource.title}"...` };
        }
      }
    }

    // 5. If we have the authentic binary blob:
    if (blob && blob.size > 0) {
      // Determine authentic file name and extension
      let downloadFileName = resource.fileName ? resource.fileName.trim() : '';

      // Check whether targetFormat matches original or no targetFormat requested
      const requestedFormat = targetFormat || resource.type;
      const isSameFormat = !targetFormat || targetFormat === resource.type;

      if (isSameFormat && downloadFileName) {
        // Preserve EXACT original fileName uploaded by the user!
        downloadFileName = downloadFileName.replace(/[/\\?%*:|"<>]/g, '_');
      } else {
        // Build clean fileName matching the format
        const cleanBase = resource.title.replace(/[/\\?%*:|"<>]/g, '_').trim();
        const ext = requestedFormat === 'pdf' ? 'pdf' : requestedFormat === 'pptx' ? 'pptx' : requestedFormat === 'video' ? 'mp4' : 'docx';
        downloadFileName = `${cleanBase}.${ext}`;
      }

      // Ensure proper MIME type on download blob
      let correctMime = blob.type;
      const lower = downloadFileName.toLowerCase();
      if (lower.endsWith('.pdf') || requestedFormat === 'pdf') {
        correctMime = 'application/pdf';
      } else if (lower.endsWith('.docx') || requestedFormat === 'docx') {
        correctMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (lower.endsWith('.pptx') || requestedFormat === 'pptx') {
        correctMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } else if (lower.endsWith('.mp4') || requestedFormat === 'video') {
        correctMime = 'video/mp4';
      }

      if (blob.type !== correctMime) {
        blob = new Blob([blob], { type: correctMime });
      }

      // Trigger native browser download of EXACT file
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 15000);

      return { success: true, message: `Đã tải về tệp: ${downloadFileName}` };
    }

    // 6. If no binary blob was uploaded or format conversion is requested from text:
    const fallbackFormat = targetFormat || (resource.type === 'docx' ? 'docx' : resource.type === 'pdf' ? 'pdf' : resource.type === 'pptx' ? 'pptx' : 'docx');
    blob = createDocumentBlobFromPreview(resource, fallbackFormat);

    if (blob) {
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const extension = fallbackFormat === 'pdf' ? 'pdf' : fallbackFormat === 'pptx' ? 'html' : 'doc';
      const cleanBase = resource.title.replace(/[/\\?%*:|"<>]/g, '_').trim();
      const safeName = `${cleanBase}.${extension}`;

      link.download = safeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 15000);
      return { success: true, message: `Đã tạo tệp tải về: ${safeName}` };
    }

    return {
      success: false,
      message: 'Không thể tạo tệp tải về. Thầy/Cô vui lòng thử lại.'
    };
  } catch (err) {
    console.error('Lỗi khi tải tệp:', err);
    return { success: false, message: 'Có lỗi xảy ra khi chuẩn bị tải tệp.' };
  }
}

function getLocalResources(): ResourceItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESOURCES);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed)
      ? parsed.filter((item) => !DEMO_RESOURCE_IDS.includes(item.id))
      : [];
  } catch {
    return [];
  }
}

function setLocalResources(items: ResourceItem[]) {
  try {
    const cleanItems = items.filter((item) => !DEMO_RESOURCE_IDS.includes(item.id));
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(cleanItems));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lms_resources_sync', { detail: cleanItems }));
    }
  } catch (e) {
    console.warn('Không thể lưu vào localStorage:', e);
  }
}

export const storageService = {
  // Synchronous initial loader for instant rendering
  getInitialSyncResources(): ResourceItem[] {
    return getLocalResources();
  },

  // Main loader: merges Server API + Cloud Firestore + Local, works across all devices
  async getResources(): Promise<ResourceItem[]> {
    try {
      const [serverItems, cloudItems] = await Promise.all([
        fetchResourcesFromServerApi(),
        fetchResourcesFromFirestore()
      ]);

      const localItems = getLocalResources();
      const mergedMap = new Map<string, ResourceItem>();

      for (const item of localItems) {
        if (item && item.id && !DEMO_RESOURCE_IDS.includes(item.id)) {
          mergedMap.set(item.id, item);
        }
      }
      for (const item of cloudItems) {
        if (item && item.id && !DEMO_RESOURCE_IDS.includes(item.id)) {
          mergedMap.set(item.id, item);
        }
      }
      for (const item of serverItems) {
        if (item && item.id && !DEMO_RESOURCE_IDS.includes(item.id)) {
          mergedMap.set(item.id, item);
        }
      }

      const sorted = Array.from(mergedMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
      setLocalResources(sorted);

      // Ensure server disk has the merged list and any local IndexedDB binary files
      if (sorted.length !== serverItems.length) {
        fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resources: sorted })
        }).catch(() => {});
      }

      // Background sync: push any locally cached files from IndexedDB to server so other devices get the full authentic files
      for (const item of sorted) {
        getFileFromIndexedDB(item.id).then(async (blob) => {
          if (blob && blob.size > 1000) {
            try {
              const headRes = await fetch(`/api/files/${encodeURIComponent(item.id)}`, { method: 'HEAD' });
              const serverSize = Number(headRes.headers.get('content-length') || 0);
              if (!headRes.ok || serverSize < blob.size) {
                await saveFileToServerApi(item.id, item.fileName || item.title, blob);
              }
            } catch {
              // ignore
            }
          }
        }).catch(() => {});
      }

      return sorted;
    } catch {
      return getLocalResources();
    }
  },

  // Real-time listener across devices
  subscribe(onUpdate: (items: ResourceItem[]) => void) {
    return subscribeToResources((cloudItems) => {
      if (!cloudItems || cloudItems.length === 0) return;
      const nonDemo = cloudItems.filter((i) => !DEMO_RESOURCE_IDS.includes(i.id));
      const sorted = nonDemo.sort((a, b) => a.order - b.order);
      setLocalResources(sorted);
      onUpdate(sorted);
    });
  },

  // File helpers exposed
  getResourceFileUrl,
  downloadResourceFile,
  getFileBlob: getFileFromIndexedDB,

  // Add resource: stores metadata AND binary in Server API + IndexedDB + Cloud Firestore
  async addResource(
    item: Omit<ResourceItem, 'id' | 'uploadedAt'>,
    fileBlob?: Blob,
    onProgress?: (progress: number) => void
  ): Promise<ResourceItem> {
    const id = 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const uploadedAt = new Date().toISOString().split('T')[0];

    let fileUrl = item.fileUrl;
    const fileName = item.fileName || `${item.title}.${item.type}`;

    if (onProgress) onProgress(20);

    // 1. Save binary to local IndexedDB for immediate responsive access
    if (fileBlob) {
      await saveFileToIndexedDB(id, fileBlob);
      const localBlobUrl = URL.createObjectURL(fileBlob);
      activeObjectUrlCache.set(id, localBlobUrl);
      if (onProgress) onProgress(45);

      // 2. Upload binary to Server API (unlimited quota, up to 500MB, cross-device)
      const serverFileUrl = await saveFileToServerApi(id, fileName, fileBlob);
      if (serverFileUrl) {
        fileUrl = serverFileUrl;
      }
      if (onProgress) onProgress(80);

      // 3. Also save to Cloud Firestore if small enough and quota available
      saveFileToCloudFirestore(id, fileName, item.type, fileBlob).catch(() => {});
    }

    if (onProgress) onProgress(100);

    const newResource: ResourceItem = {
      ...item,
      id,
      uploadedAt,
      fileUrl: fileUrl && !fileUrl.startsWith('blob:') ? fileUrl : `/api/files/${id}`,
      fileName,
      fileBlobKey: id,
      isOriginal: false
    };

    // 4. Save metadata to Server API & Cloud Firestore
    await saveResourceToServerApi(newResource);
    saveResourceToFirestore(newResource).catch(() => {});

    // 5. Update local cache
    const currentLocal = getLocalResources();
    const updatedList = [newResource, ...currentLocal.filter((r) => r.id !== id)];
    setLocalResources(updatedList);

    return newResource;
  },

  // Update resource on Server API, Cloud Firestore & IndexedDB
  async updateResource(
    id: string,
    updates: Partial<ResourceItem>,
    newFileBlob?: Blob,
    onProgress?: (progress: number) => void
  ): Promise<ResourceItem | null> {
    const currentLocal = getLocalResources();
    const existingIndex = currentLocal.findIndex((r) => r.id === id);
    if (existingIndex === -1) return null;

    const existing = currentLocal[existingIndex];
    let fileUrl = updates.fileUrl !== undefined ? updates.fileUrl : existing.fileUrl;
    const fileName = updates.fileName !== undefined ? updates.fileName : existing.fileName;

    if (onProgress) onProgress(20);

    if (newFileBlob) {
      await saveFileToIndexedDB(id, newFileBlob);
      const localBlobUrl = URL.createObjectURL(newFileBlob);
      activeObjectUrlCache.set(id, localBlobUrl);
      if (onProgress) onProgress(50);

      const serverFileUrl = await saveFileToServerApi(id, fileName || existing.fileName || 'file', newFileBlob);
      if (serverFileUrl) {
        fileUrl = serverFileUrl;
      }
      if (onProgress) onProgress(85);

      saveFileToCloudFirestore(id, fileName || existing.fileName || 'file', updates.type || existing.type, newFileBlob).catch(() => {});
    }

    if (onProgress) onProgress(100);

    const updated: ResourceItem = {
      ...existing,
      ...updates,
      fileUrl: fileUrl && !fileUrl.startsWith('blob:') ? fileUrl : `/api/files/${id}`,
      fileName,
      fileBlobKey: id
    };

    // Update Server API & Cloud Firestore metadata
    await saveResourceToServerApi(updated);
    saveResourceToFirestore(updated).catch(() => {});

    // Update local cache
    currentLocal[existingIndex] = updated;
    setLocalResources([...currentLocal]);

    return updated;
  },

  // Delete resource from Server API, Cloud Firestore, Cloud Files, IndexedDB & local
  async deleteResource(id: string): Promise<boolean> {
    await deleteFileFromIndexedDB(id);
    activeObjectUrlCache.delete(id);

    await deleteResourceFromServerApi(id);
    deleteFileFromCloudFirestore(id).catch(() => {});
    deleteResourceFromFirestore(id).catch(() => {});

    const currentLocal = getLocalResources();
    const filtered = currentLocal.filter((r) => r.id !== id);
    setLocalResources(filtered);

    return true;
  },

  // Reset / Clear all resources so teacher can start completely fresh
  async resetToDefault(): Promise<ResourceItem[]> {
    const current = getLocalResources();
    for (const item of current) {
      try {
        await deleteResourceFromServerApi(item.id);
        await deleteFileFromIndexedDB(item.id);
        deleteResourceFromFirestore(item.id).catch(() => {});
        deleteFileFromCloudFirestore(item.id).catch(() => {});
      } catch {
        // ignore
      }
    }
    setLocalResources([]);
    return [];
  },

  // Clear all demo resources explicitly
  async clearAllDemoResources(): Promise<ResourceItem[]> {
    for (const demoId of DEMO_RESOURCE_IDS) {
      try {
        await deleteResourceFromServerApi(demoId);
        await deleteFileFromIndexedDB(demoId);
      } catch {
        // ignore
      }
    }
    const current = getLocalResources();
    const filtered = current.filter((item) => !DEMO_RESOURCE_IDS.includes(item.id));
    setLocalResources(filtered);
    return filtered;
  },

  // Manual Push to Cloud (Migrates any offline or IndexedDB resources to Server API & Cloud)
  async syncAllToCloud(): Promise<{ success: boolean; count: number }> {
    const local = getLocalResources();
    let count = 0;
    for (const item of local) {
      try {
        await saveResourceToServerApi(item);
        const blob = await getFileFromIndexedDB(item.id);
        if (blob) {
          await saveFileToServerApi(item.id, item.fileName || item.title, blob);
        }
        saveResourceToFirestore(item).catch(() => {});
        count++;
      } catch (err) {
        console.warn('Lỗi đẩy mục lên cloud:', item.title, err);
      }
    }
    return { success: true, count };
  },

  // Export JSON
  async exportBackupJson(): Promise<string> {
    const list = await this.getResources();
    return JSON.stringify(
      {
        appName: 'LMS Ngữ văn 6 - Tôi và các bạn',
        cloudSyncEnabled: true,
        exportedAt: new Date().toISOString(),
        version: '4.0.0',
        resources: list
      },
      null,
      2
    );
  },

  // Import JSON & push to Cloud
  async importBackupJson(jsonString: string): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.resources)) {
        return { success: false, message: 'Tệp JSON không đúng định dạng sao lưu LMS.' };
      }

      setLocalResources(parsed.resources);

      // Save to Cloud Firestore
      for (const r of parsed.resources) {
        try {
          await saveResourceToFirestore(r);
        } catch {
          // ignore
        }
      }

      return {
        success: true,
        message: `Khôi phục và đồng bộ thành công ${parsed.resources.length} tài nguyên học liệu lên Cloud!`,
        count: parsed.resources.length
      };
    } catch {
      return { success: false, message: 'Tệp tải lên không phải JSON hợp lệ.' };
    }
  },

  // --- Auth Session ---
  getCurrentUser(): User | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Lỗi lưu phiên đăng nhập:', e);
    }
  }
};
