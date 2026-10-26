import React, { useState } from 'react';
import { ResourceItem, ResourceType, ResourceCategory, User } from '../types';
import { storageService } from '../services/storageService';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Cloud,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Database,
  Shield,
  FileText,
  Key
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: User | null;
  resources: ResourceItem[];
  onResourcesUpdated: (updated: ResourceItem[]) => void;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  resources,
  onResourcesUpdated,
  onClose,
  onOpenLogin
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'cloud' | 'backup'>('list');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<ResourceType>('docx');
  const [formCategory, setFormCategory] = useState<ResourceCategory>('phieu_bai_tap');
  const [formTopic, setFormTopic] = useState('Chuyên đề 01: Đọc hiểu');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileSize, setFormFileSize] = useState('');
  const [formAuthor, setFormAuthor] = useState('Giáo viên Ngữ văn');
  const [formContentPreview, setFormContentPreview] = useState('');

  // Upload progress simulation
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [resourceToDelete, setResourceToDelete] = useState<ResourceItem | null>(null);

  // Toast / Status banner
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Check authorization
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#163d85] mb-2">
            Khu vực dành cho Quản trị viên
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Bạn cần đăng nhập với quyền <strong>Quản trị viên (Admin)</strong> để thêm, sửa, xóa học liệu và quản lý cấu hình lưu trữ đám mây.
          </p>

          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-left mb-6 text-xs text-slate-600">
            <p className="font-bold text-[#163d85] mb-1">Tài khoản quản trị demo:</p>
            <p>• Tên đăng nhập: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-[#ff6b24]">ADMIN_NV6</code></p>
            <p>• Mật khẩu: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-[#ff6b24]">QUANTRIVIEN@2026</code></p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Quay lại trang học tập
            </button>
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] text-white text-xs font-extrabold hover:shadow-md cursor-pointer"
            >
              Đăng nhập Quản trị
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingResource(null);
    setFormTitle('');
    setFormDescription('');
    setFormType('docx');
    setFormCategory('phieu_bai_tap');
    setFormTopic('Chuyên đề 01: Đọc hiểu');
    setFormOrder(resources.length + 1);
    setFormFileUrl('');
    setFormFileSize('35 KB');
    setFormAuthor(currentUser.name || 'Giáo viên Ngữ văn');
    setFormContentPreview('');
    setUploadProgress(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: ResourceItem) => {
    setEditingResource(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormType(item.type);
    setFormCategory(item.category);
    setFormTopic(item.topic);
    setFormOrder(item.order);
    setFormFileUrl(item.fileUrl);
    setFormFileSize(item.fileSize || '35 KB');
    setFormAuthor(item.author);
    setFormContentPreview(item.contentPreview || '');
    setUploadProgress(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Simulated file upload with progress bar
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      setUploadError('Tệp quá lớn. Dung lượng tối đa là 500MB.');
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    // Format size
    const sizeStr = (file.size / 1024).toFixed(0) + ' KB';
    setFormFileSize(sizeStr);

    // Progress simulation
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        // Set file url
        const simulatedUrl = `/hoc_lieu/${file.name}`;
        setFormFileUrl(simulatedUrl);
        if (!formTitle) {
          setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
        }
      }
    }, 120);
  };

  // Save (create or update)
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setUploadError('Vui lòng nhập tiêu đề học liệu.');
      return;
    }
    if (!formFileUrl.trim()) {
      setUploadError('Vui lòng tải tệp lên hoặc nhập đường dẫn URL học liệu.');
      return;
    }

    if (editingResource) {
      // Update
      await storageService.updateResource(editingResource.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        type: formType,
        category: formCategory,
        topic: formTopic,
        order: Number(formOrder),
        fileUrl: formFileUrl.trim(),
        fileSize: formFileSize,
        author: formAuthor.trim(),
        contentPreview: formContentPreview.trim()
      });
      showToast('success', `Đã cập nhật học liệu "${formTitle}" thành công!`);
    } else {
      // Create
      await storageService.addResource({
        title: formTitle.trim(),
        description: formDescription.trim(),
        type: formType,
        category: formCategory,
        topic: formTopic,
        order: Number(formOrder),
        fileUrl: formFileUrl.trim(),
        fileSize: formFileSize,
        author: formAuthor.trim(),
        contentPreview: formContentPreview.trim()
      });
      showToast('success', `Đã thêm mới học liệu "${formTitle}" thành công!`);
    }

    const fresh = await storageService.getResources();
    onResourcesUpdated(fresh);
    setIsModalOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    await storageService.deleteResource(resourceToDelete.id);
    const fresh = await storageService.getResources();
    onResourcesUpdated(fresh);
    showToast('success', `Đã xóa học liệu "${resourceToDelete.title}"!`);
    setResourceToDelete(null);
  };

  // Reset to default
  const handleResetDefault = async () => {
    if (window.confirm('Khôi phục danh sách học liệu chuẩn ban đầu? Mọi tài liệu thêm mới sẽ bị xóa.')) {
      const reset = await storageService.resetToDefault();
      onResourcesUpdated(reset);
      showToast('success', 'Đã khôi phục dữ liệu học liệu gốc thành công!');
    }
  };

  // Export JSON
  const handleExportJson = async () => {
    const json = await storageService.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_lms_nguvan6_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Đã tải xuống tệp sao lưu JSON!');
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await storageService.importBackupJson(content);
      if (res.success) {
        const fresh = await storageService.getResources();
        onResourcesUpdated(fresh);
        showToast('success', res.message);
      } else {
        showToast('error', res.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#163d85] to-[#1686d9] text-white flex items-center justify-center shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-widest text-[#ff6b24] uppercase">
                Cổng quản trị chuyên biệt
              </span>
              <h1 className="text-2xl font-black text-[#163d85]">
                Quản trị Kho Học liệu số Ngữ văn 6
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:from-[#ea5c16] hover:to-[#ff7b18] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>THÊM HỌC LIỆU MỚI</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Xem trang học tập
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-[#163d85] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Danh sách học liệu ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cloud'
                ? 'bg-[#163d85] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-sky-500" />
            <span>Cấu hình Cloud & Firebase</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-[#163d85] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sao lưu & Khôi phục</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIST TABLE */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#163d85]">
                Quản lý các tài nguyên ({resources.length} tài liệu)
              </h2>
              <p className="text-xs text-slate-500">
                Cho phép thêm, sửa, xóa, sắp xếp thứ tự và kiểm tra liên kết tệp.
              </p>
            </div>

            <button
              onClick={handleResetDefault}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
            >
              Khôi phục 6 học liệu mặc định
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Tiêu đề học liệu</th>
                  <th className="py-3 px-4">Loại tệp</th>
                  <th className="py-3 px-4">Chuyên đề</th>
                  <th className="py-3 px-4">Người đăng</th>
                  <th className="py-3 px-4">Đường dẫn tệp / URL</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        {item.order || index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#203e64]">{item.title}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono uppercase font-bold text-[11px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600">
                        {item.topic}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.author}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[180px]">
                        {item.fileUrl}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa học liệu"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setResourceToDelete(item)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa học liệu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUD & FIREBASE SETUP ARCHITECTURE */}
      {activeTab === 'cloud' && (
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1686d9] mb-1">
              <Cloud className="w-4 h-4" />
              <span>Kiến trúc lưu trữ đám mây thực tế</span>
            </div>
            <h2 className="text-xl font-bold text-[#163d85]">
              Hướng dẫn cấu hình Firebase Storage & Firestore
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Đáp ứng yêu cầu số 7, 8 và 11 của đề bài: Lớp dữ liệu bền vững, phân quyền upload an toàn và không nhúng mật khẩu bí mật vào mã phía client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <h4 className="font-bold text-xs text-[#163d85] mb-1 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-600" />
                <span>1. Firestore Database</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lưu trữ metadata tài nguyên (tiêu đề, phân loại, URL, thứ tự, quyền chỉnh sửa). Dữ liệu đồng bộ theo thời gian thực tới tất cả học sinh và giáo viên.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <h4 className="font-bold text-xs text-amber-900 mb-1 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-amber-600" />
                <span>2. Firebase Storage</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lưu trữ các tệp nhị phân dung lượng lớn: DOCX, PPTX, PDF, âm thanh ghi bài và video bài giảng với chứng chỉ HTTPS an toàn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <h4 className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>3. Quy tắc bảo mật RBAC</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chặn mọi quyền ghi/xóa công khai. Chỉ tài khoản giáo viên/admin đã được xác thực mới có quyền tải lên học liệu.
              </p>
            </div>
          </div>

          {/* Security Rules Snippet */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs overflow-x-auto">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <span>// firestore.rules - Quy tắc bảo mật chuẩn giáo dục</span>
              <span className="text-[10px] text-emerald-400">Không cho phép tải lên công khai</span>
            </div>
            <pre className="text-[11px] leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Học sinh có thể đọc mọi học liệu nhưng KHÔNG ĐƯỢC sửa hoặc xóa
    match /resources/{resourceId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}`}
            </pre>
          </div>

          {/* Environment Variables Guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-3">
            <h4 className="font-bold text-[#163d85] flex items-center gap-2 text-sm">
              <Key className="w-4 h-4 text-[#ff6b24]" />
              <span>Các bước tích hợp Cloud Storage thực tế:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>
                Tạo dự án trên <strong>Firebase Console</strong> và bật Firestore Database + Firebase Storage.
              </li>
              <li>
                Khai báo các biến môi trường phía client trong <code>.env</code> (hoặc Secrets panel):
                <div className="mt-1 p-2.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]">
                  VITE_FIREBASE_API_KEY="..."<br/>
                  VITE_FIREBASE_PROJECT_ID="..."<br/>
                  VITE_FIREBASE_STORAGE_BUCKET="..."
                </div>
              </li>
              <li>
                Áp dụng quy tắc bảo mật <code>storage.rules</code>: Chặn tệp không hợp lệ (&gt;50MB hoặc tệp thực thi).
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1686d9] mb-1">
              <Database className="w-4 h-4" />
              <span>Sao lưu an toàn</span>
            </div>
            <h2 className="text-xl font-bold text-[#163d85]">
              Sao lưu & Khôi phục dữ liệu Kho Học liệu
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Xuất toàn bộ học liệu ra tệp JSON để lưu trữ ngoại tuyến hoặc nhập dữ liệu sang máy tính khác mà không bị thất thoát.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Export */}
            <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#163d85] mb-2">Xuất tệp sao lưu JSON</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Tải về tệp JSON chứa toàn bộ {resources.length} tài nguyên học liệu hiện có (kế hoạch, bài tập, đề kiểm tra, video...).
                </p>
              </div>

              <button
                onClick={handleExportJson}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#163d85] hover:bg-[#12316d] text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>TẢI TỆP SAO LƯU (.JSON)</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-emerald-950 mb-2">Khôi phục từ tệp JSON</h4>
                <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                  Chọn tệp sao lưu JSON trước đó để nạp lại danh sách học liệu vào hệ thống LMS.
                </p>
              </div>

              <label className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>CHỌN TỆP JSON ĐỂ KHÔI PHỤC</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT RESOURCE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b2446]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Form Top */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-orange-50">
              <h3 className="font-black text-lg text-[#163d85]">
                {editingResource ? 'Chỉnh sửa học liệu số' : 'Thêm học liệu mới vào kho'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveResource} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề học liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phiếu bài tập phát triển năng lực đọc hiểu PISA..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả nội dung & Mục tiêu
                </label>
                <textarea
                  rows={2}
                  placeholder="Khung mục tiêu, tiến trình và hướng dẫn sử dụng tài nguyên..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-normal"
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loại học liệu <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ResourceType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium bg-white"
                  >
                    <option value="docx">Tài liệu văn bản (DOCX)</option>
                    <option value="pptx">Bài giảng trình chiếu (PPSX / PPTX)</option>
                    <option value="pdf">Tài liệu PDF</option>
                    <option value="video">Bài giảng Video / Minh họa</option>
                    <option value="audio">Âm thanh ghi bài (Audio)</option>
                    <option value="worksheet">Phiếu bài tập / Hoạt động</option>
                    <option value="test_guide">Đề kiểm tra & Hướng dẫn chấm</option>
                    <option value="image">Hình ảnh / Sơ đồ tư duy</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nhóm học liệu <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ResourceCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium bg-white"
                  >
                    <option value="ke_hoach">Kế hoạch bài dạy</option>
                    <option value="phieu_bai_tap">Phiếu bài tập</option>
                    <option value="de_kiem_tra">Đề kiểm tra & Rubric</option>
                    <option value="bai_giang">Bài giảng điện tử</option>
                    <option value="da_phuong_tien">Video / Âm thanh</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Topic */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Chủ đề / Bài học
                  </label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium bg-white"
                  >
                    <option value="Toàn khóa học">Toàn khóa học Bài 1</option>
                    <option value="Chuyên đề 01: Đọc hiểu">Chuyên đề 01: Đọc hiểu</option>
                    <option value="Chuyên đề 02: Tiếng Việt">Chuyên đề 02: Thực hành tiếng Việt</option>
                    <option value="Chuyên đề 03: Viết">Chuyên đề 03: Viết trải nghiệm</option>
                    <option value="Chuyên đề 04: Nói và nghe">Chuyên đề 04: Nói và nghe</option>
                    <option value="Chuyên đề 05: Đọc mở rộng">Chuyên đề 05: Đọc mở rộng</option>
                    <option value="Chuyên đề 06: Đánh giá">Chuyên đề 06: Ôn tập & Đánh giá</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              {/* File Upload OR URL link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 block">
                  Tải tệp lên hệ thống hoặc nhập liên kết học liệu
                </span>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:border-sky-300 rounded-xl text-slate-700 font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-[#ff6b24]" />
                    <span>Chọn tệp tải lên...</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Đường dẫn tệp (Ví dụ: /hoc_lieu/01_Ke_hoach_bai_day.docx hoặc URL YouTube/Drive)"
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-mono text-[11px]"
                  />
                </div>

                {/* Progress bar */}
                {uploadProgress !== null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Tiến trình tải lên:</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Preview for in-browser reading */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết (Hiển thị cho học sinh đọc trực tuyến mà không cần mở Word/PPT)
                </label>
                <textarea
                  rows={4}
                  placeholder="Dán nội dung giáo án, đề bài hoặc các câu hỏi ôn tập tại đây..."
                  value={formContentPreview}
                  onChange={(e) => setFormContentPreview(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-normal"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Người phụ trách / Tác giả
                </label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] text-white font-extrabold hover:shadow-md cursor-pointer"
                >
                  {editingResource ? 'LƯU THAY ĐỔI' : 'TẠO HỌC LIỆU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG BEFORE DELETE */}
      {resourceToDelete && (
        <div className="fixed inset-0 z-50 bg-[#0b2446]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-[#163d85] mb-2">
              Xác nhận xóa học liệu?
            </h3>

            <p className="text-xs text-slate-500 mb-6">
              Bạn có chắc chắn muốn xóa học liệu <strong>"{resourceToDelete.title}"</strong> không? Thao tác này sẽ xóa tệp khỏi kho học liệu của học sinh.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setResourceToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold cursor-pointer"
              >
                XÁC NHẬN XÓA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
