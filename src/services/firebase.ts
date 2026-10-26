import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  getDocFromServer,
  writeBatch,
  onSnapshot,
  setLogLevel,
  disableNetwork
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { ResourceItem } from '../types';

// Silence internal Firestore SDK backoff/quota console spam; errors are handled gracefully by application code
try {
  setLogLevel('silent');
} catch {
  // ignore
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Circuit breaker when Firestore free-tier daily write quota is exhausted
let isFirestoreWriteQuotaExhausted = false;

function checkAndHandleQuotaExhausted(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const code = (err as any)?.code || '';
  if (
    code === 'resource-exhausted' ||
    msg.includes('resource-exhausted') ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Quota exceeded')
  ) {
    if (!isFirestoreWriteQuotaExhausted) {
      isFirestoreWriteQuotaExhausted = true;
      // Stop background write retry stream to prevent infinite backoff loops
      disableNetwork(db).catch(() => {});
    }
    return true;
  }
  return false;
}

// Error Handling conforming to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: boolean | string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function validateFirestoreConnection(): Promise<boolean> {
  if (isFirestoreWriteQuotaExhausted) return false;
  try {
    await getDocFromServer(doc(db, 'resources', 'test_connection'));
    return true;
  } catch (error) {
    if (checkAndHandleQuotaExhausted(error)) return false;
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return false;
    }
    return true;
  }
}

// Convert Blob to Base64 String
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result;
      if (typeof res === 'string') {
        resolve(res);
      } else {
        reject(new Error('Failed to convert Blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert Base64 String back to Blob
export function base64ToBlob(dataUrl: string, defaultType: string = 'application/octet-stream'): Blob {
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : defaultType;
    const b64 = parts[1] || parts[0];
    const byteChars = atob(b64);
    const sliceSize = 1024 * 64; // 64KB slices
    const byteArrays: BlobPart[] = [];
    for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
      const slice = byteChars.slice(offset, offset + sliceSize);
      const byteNumbers = new Uint8Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(byteNumbers);
    }
    return new Blob(byteArrays, { type: mime });
  } catch (err) {
    console.error('Lỗi chuyển base64 sang Blob:', err);
    return new Blob([], { type: defaultType });
  }
}

// ==========================================
// 1. CLOUD FILE STORAGE IN FIRESTORE
// ==========================================
const CHUNK_SIZE = 600000; // ~600KB base64 chars, safely within 1MB doc limit

export async function saveFileToCloudFirestore(
  _resourceId: string,
  _fileName: string,
  _fileType: string,
  _fileBlob: Blob
): Promise<boolean> {
  // Binary files are securely stored and streamed via /api/files/:id up to 500MB
  // Storing binary chunks in Firestore documents violates Firestore 1MB limits and exhausts daily write quotas
  return true;
}

export async function getFileFromCloudFirestore(resourceId: string): Promise<Blob | null> {
  if (isFirestoreWriteQuotaExhausted) return null;
  const path = `resource_files/${resourceId}`;
  try {
    const docRef = doc(db, 'resource_files', resourceId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    if (!data) return null;

    if (data.dataBase64) {
      return base64ToBlob(data.dataBase64, data.fileType || 'application/octet-stream');
    }

    if (data.totalChunks && data.totalChunks > 1) {
      const chunksCol = collection(db, 'resource_files', resourceId, 'chunks');
      const chunksSnap = await getDocs(chunksCol);
      const chunkMap = new Map<number, string>();
      chunksSnap.forEach((c) => {
        const cData = c.data();
        chunkMap.set(cData.index, cData.chunkData);
      });
      let fullBase64 = '';
      for (let i = 0; i < data.totalChunks; i++) {
        fullBase64 += chunkMap.get(i) || '';
      }
      if (fullBase64) {
        return base64ToBlob(fullBase64, data.fileType || 'application/octet-stream');
      }
    }

    return null;
  } catch (err) {
    if (checkAndHandleQuotaExhausted(err)) return null;
    if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.GET, path);
    }
    return null;
  }
}

export async function deleteFileFromCloudFirestore(resourceId: string): Promise<void> {
  if (isFirestoreWriteQuotaExhausted) return;
  const path = `resource_files/${resourceId}`;
  try {
    const docRef = doc(db, 'resource_files', resourceId);
    await deleteDoc(docRef);
  } catch (err) {
    if (checkAndHandleQuotaExhausted(err)) return;
    if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}

// ==========================================
// 2. FIREBASE STORAGE (OPTIONAL / FAST CLOUD HTTPS)
// ==========================================
export async function uploadFileToStorage(
  file: File | Blob,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storageRef = ref(storage, `hoc_lieu/${cleanName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// ==========================================
// 3. FIRESTORE RESOURCES METADATA OPERATIONS
// ==========================================
export async function fetchResourcesFromFirestore(): Promise<ResourceItem[]> {
  if (isFirestoreWriteQuotaExhausted) return [];
  const path = 'resources';
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const items: ResourceItem[] = [];
    snapshot.forEach((d) => {
      if (d.id !== 'test_connection') {
        items.push(d.data() as ResourceItem);
      }
    });
    return items;
  } catch (e) {
    if (checkAndHandleQuotaExhausted(e)) return [];
    if (e instanceof Error && e.message.includes('Missing or insufficient permissions')) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
    return [];
  }
}

// Subscribe to real-time changes across devices
export function subscribeToResources(onUpdate: (items: ResourceItem[]) => void): () => void {
  if (isFirestoreWriteQuotaExhausted) return () => {};
  const path = 'resources';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ResourceItem[] = [];
      snapshot.forEach((d) => {
        if (d.id !== 'test_connection') {
          items.push(d.data() as ResourceItem);
        }
      });
      onUpdate(items);
    },
    (error) => {
      if (checkAndHandleQuotaExhausted(error)) return;
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

export async function saveResourceToFirestore(item: ResourceItem): Promise<void> {
  if (isFirestoreWriteQuotaExhausted) return;
  const path = `resources/${item.id}`;
  try {
    const docRef = doc(db, 'resources', item.id);
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(item)) {
      if (val !== undefined) {
        cleaned[key] = val;
      }
    }
    if (typeof cleaned.fileUrl === 'string' && cleaned.fileUrl.startsWith('blob:')) {
      cleaned.fileUrl = '';
    }
    await setDoc(docRef, cleaned);
  } catch (e) {
    if (checkAndHandleQuotaExhausted(e)) return;
    if (e instanceof Error && e.message.includes('Missing or insufficient permissions')) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function deleteResourceFromFirestore(id: string): Promise<void> {
  if (isFirestoreWriteQuotaExhausted) return;
  const path = `resources/${id}`;
  try {
    const docRef = doc(db, 'resources', id);
    await deleteDoc(docRef);
  } catch (e) {
    if (checkAndHandleQuotaExhausted(e)) return;
    if (e instanceof Error && e.message.includes('Missing or insufficient permissions')) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
}

// Google Login with popup for real teacher/admin login
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function logoutFirebase() {
  return signOut(auth);
}
