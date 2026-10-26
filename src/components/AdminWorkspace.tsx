import React, { useState } from 'react';
import { ResourceItem, ResourceType, ResourceCategory, User } from '../types';
import { storageService } from '../services/storageService';
import {
  Search,
  Download,
  Eye,
  FileText,
  Presentation,
  Film,
  Music,
  CheckSquare,
  PlusCircle,
  Edit2,
  Trash2,
  Upload,
  AlertTriangle,
  Check,
  CheckCircle2,
  Database,
  Image as ImageIcon,
  RotateCcw,
  X,
  FileUp,
  Info,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  Table as TableIcon,
  FolderOpen
} from 'lucide-react';

interface AdminWorkspaceProps {
  resources: ResourceItem[];
  currentUser: User;
  onResourcesUpdated: (updated: ResourceItem[]) => void;
  onSelectResource: (resource: ResourceItem) => void;
  onSwitchToStudentView: () => void;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  resources,
  currentUser,
  onResourcesUpdated,
  onSelectResource,
  onSwitchToStudentView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Form Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<ResourceItem | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<ResourceType>('docx');
  const [formCategory, setFormCategory] = useState<ResourceCategory>('phieu_bai_tap');
  const [formTopic, setFormTopic] = useState('Chuyên đề 01: Đọc hiểu');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formFileSize, setFormFileSize] = useState('');
  const [formAuthor, setFormAuthor] = useState('Giáo viên Ngữ văn');
  const [formContentPreview, setFormContentPreview] = useState('');
  const [selectedFileBlob, setSelectedFileBlob] = useState<Blob | null>(null);
  const [formMatrixCode, setFormMatrixCode] = useState<string>('');

  // Upload Feedback
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync all documents to Cloud Firestore so any remote computer has everything
  const handleSyncAllCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await storageService.syncAllToCloud();
      const freshList = await storageService.getResources();
      onResourcesUpdated(freshList);
      showToast(
        'success',
        `Đã đồng bộ ${freshList.length} tài liệu lên Cloud Firestore! Mọi máy tính khác và học sinh đều có thể truy cập & tải về ngay.`
      );
    } catch {
      showToast('error', 'Có lỗi khi đồng bộ đám mây. Vui lòng thử lại.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Open Form for Adding New Resource
  const handleOpenAdd = () => {
    setEditingResource(null);
    setFormTitle('');
    setFormDescription('');
    setFormType('docx');
    setFormCategory('phieu_bai_tap');
    setFormTopic('Chuyên đề 01: Đọc hiểu');
    setFormOrder(resources.length + 1);
    setFormFileUrl('');
    setFormFileName('');
    setFormFileSize('35 KB');
    setFormAuthor(currentUser.name || 'ADIM (Cô Tú Lành)');
    setFormContentPreview('');
    setFormMatrixCode('');
    setSelectedFileBlob(null);
    setUploadProgress(null);
    setIsSaving(false);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Open Form for Editing / Replacing File
  const handleOpenEdit = (item: ResourceItem) => {
    setEditingResource(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormType(item.type);
    setFormCategory(item.category);
    setFormTopic(item.topic);
    setFormOrder(item.order);
    setFormFileUrl(item.fileUrl);
    setFormFileName(item.fileName || '');
    setFormFileSize(item.fileSize || '35 KB');
    setFormAuthor(item.author);
    setFormContentPreview(item.contentPreview || '');
    setFormMatrixCode(item.matrixCode || '');
    setSelectedFileBlob(null);
    setUploadProgress(null);
    setIsSaving(false);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Helper to download any resource file cleanly
  const handleDownloadResource = async (res: ResourceItem) => {
    const result = await storageService.downloadResourceFile(res);
    if (result.success) {
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  };

  // File selection & instant 100% preparation with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      setFormError('Dung lượng tệp vượt quá 500MB. Vui lòng chọn tệp nhỏ hơn 500MB.');
      return;
    }

    setFormError(null);

    const sizeFormatted =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

    setFormFileName(file.name);
    setFormFileSize(sizeFormatted);
    setSelectedFileBlob(file);

    // Auto-detect type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'docx' || ext === 'doc') setFormType('docx');
    else if (ext === 'pdf') setFormType('pdf');
    else if (ext === 'pptx' || ext === 'ppsx' || ext === 'ppt') setFormType('pptx');
    else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) setFormType('image');
    else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) setFormType('audio');
    else if (['mp4', 'webm', 'mov'].includes(ext || '')) setFormType('video');

    if (!formTitle) {
      setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    // Immediately create preview blob URL and set 100% ready
    const tempBlobUrl = URL.createObjectURL(file);
    setFormFileUrl(tempBlobUrl);
    setUploadProgress(100);
  };

  // Save
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Vui lòng nhập tên tài liệu học liệu.');
      return;
    }
    if (!formFileUrl.trim() && !selectedFileBlob) {
      setFormError('Vui lòng chọn tệp tải lên hoặc dán đường dẫn tệp.');
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setUploadProgress(35);

    try {
      if (editingResource) {
        const updated = await storageService.updateResource(
          editingResource.id,
          {
            title: formTitle.trim(),
            description: formDescription.trim(),
            type: formType,
            category: formCategory,
            topic: formTopic,
            order: Number(formOrder),
            fileUrl: formFileUrl.trim(),
            fileName: formFileName || editingResource.fileName,
            fileSize: formFileSize,
            author: formAuthor.trim(),
            contentPreview: formContentPreview.trim(),
            matrixCode: formMatrixCode.trim() ? formMatrixCode.trim() : undefined,
            statusTag: selectedFileBlob || formFileUrl.trim() ? 'available' : 'needs_production'
          },
          selectedFileBlob || undefined,
          (prog) => setUploadProgress(prog)
        );

        if (updated) {
          const freshList = await storageService.getResources();
          onResourcesUpdated(freshList);
          showToast('success', `Đã cập nhật học liệu "${formTitle}" thành công!`);
        }
      } else {
        await storageService.addResource(
          {
            title: formTitle.trim(),
            description: formDescription.trim(),
            type: formType,
            category: formCategory,
            topic: formTopic,
            order: Number(formOrder),
            fileUrl: formFileUrl.trim() || (formFileName ? `/hoc_lieu/${formFileName}` : ''),
            fileName: formFileName,
            fileSize: formFileSize,
            author: formAuthor.trim(),
            contentPreview: formContentPreview.trim(),
            matrixCode: formMatrixCode.trim() ? formMatrixCode.trim() : undefined,
            statusTag: selectedFileBlob || formFileUrl.trim() || formFileName ? 'available' : 'needs_production'
          },
          selectedFileBlob || undefined,
          (prog) => setUploadProgress(prog)
        );

        const freshList = await storageService.getResources();
        onResourcesUpdated(freshList);
        showToast('success', `Đã lưu thành công học liệu mới "${formTitle}" vào kho!`);
      }

      setIsFormModalOpen(false);
      setUploadProgress(null);
    } catch (err) {
      setFormError('Có lỗi xảy ra khi lưu học liệu. Vui lòng kiểm tra lại tệp.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    await storageService.deleteResource(resourceToDelete.id);
    const freshList = await storageService.getResources();
    onResourcesUpdated(freshList);
    showToast('success', `Đã xóa học liệu "${resourceToDelete.title}" thành công!`);
    setResourceToDelete(null);
  };

  // Export JSON
  const handleExportBackup = async () => {
    const jsonStr = await storageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_hoc_lieu_nguvan6_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Đã tải xuống tệp sao lưu JSON!');
  };

  // Import JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const content = ev.target?.result as string;
      const res = await storageService.importBackupJson(content);
      if (res.success) {
        const freshList = await storageService.getResources();
        onResourcesUpdated(freshList);
        showToast('success', res.message);
        setIsBackupModalOpen(false);
      } else {
        showToast('error', res.message);
      }
    };
    reader.readAsText(file);
  };

  // Reset
  const handleResetToDefault = async () => {
    if (window.confirm('Khôi phục lại danh sách 6 học liệu mặc định ban đầu của Bài 1?')) {
      const resetList = await storageService.resetToDefault();
      onResourcesUpdated(resetList);
      showToast('success', 'Đã khôi phục dữ liệu học liệu gốc thành công!');
      setIsBackupModalOpen(false);
    }
  };

  // Filter
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesType =
      selectedType === 'all' || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'pptx':
        return <Presentation className="w-5 h-5 text-orange-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'video':
        return <Film className="w-5 h-5 text-rose-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'test_guide':
        return <CheckSquare className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-[#1686d9]" />;
    }
  };

  // Stats
  const docxCount = resources.filter(r => r.type === 'docx').length;
  const pptxCount = resources.filter(r => r.type === 'pptx').length;
  const mediaCount = resources.filter(r => ['video', 'audio', 'image'].includes(r.type)).length;

  return (
    <div className="py-10 bg-[#f7fbff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Workspace Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ff6b24] bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Không gian Quản trị Dữ liệu Học liệu số</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#163d85] tracking-tight">
                Quản lý Học liệu số Ngữ văn 6
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Khu vực chuyên biệt dành cho Giáo viên / Quản trị viên để thêm, sửa, thay thế tệp và xóa học liệu Bài 1: Tôi và các bạn.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Cloud Database: Google Cloud Firestore kết nối sẵn sàng</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:from-[#ea5c16] hover:to-[#ff7b18] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>TẢI LÊN HỌC LIỆU MỚI</span>
              </button>

              <button
                onClick={handleSyncAllCloud}
                disabled={isSyncingCloud}
                className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                title="Đẩy toàn bộ tài liệu học liệu hiện tại lên Cloud Firestore để máy khác và học sinh truy cập được"
              >
                <Sparkles className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                <span>{isSyncingCloud ? 'ĐANG ĐỒNG BỘ...' : 'ĐỒNG BỘ LÊN ĐÁM MÂY (CLOUD)'}</span>
              </button>

              <button
                onClick={() => setIsBackupModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Database className="w-4 h-4 text-sky-600" />
                <span>Sao lưu & Khôi phục</span>
              </button>

              <button
                onClick={onSwitchToStudentView}
                className="flex items-center gap-2 px-4 py-3 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-[#1686d9] font-bold text-xs rounded-xl transition-all cursor-pointer"
                title="Chuyển sang xem giao diện học viên"
              >
                <Eye className="w-4 h-4" />
                <span>Xem giao diện Học sinh</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Tổng số học liệu
              </span>
              <div className="text-2xl font-black text-[#163d85] mt-1 font-mono">
                {resources.length}
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                Tài liệu Word & PDF
              </span>
              <div className="text-2xl font-black text-blue-900 mt-1 font-mono">
                {docxCount}
              </div>
            </div>

            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-100">
              <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wide">
                Slide trình chiếu PPTX
              </span>
              <div className="text-2xl font-black text-orange-900 mt-1 font-mono">
                {pptxCount}
              </div>
            </div>

            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide">
                Đa phương tiện (Video/Audio)
              </span>
              <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
                {mediaCount}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all shadow-sm ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Filter and View Mode Toolbar */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, phiếu bài tập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1686d9] focus:outline-hidden bg-slate-50/50"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'ke_hoach', label: 'Kế hoạch bài dạy' },
                { id: 'phieu_bai_tap', label: 'Phiếu bài tập' },
                { id: 'de_kiem_tra', label: 'Đề kiểm tra' },
                { id: 'bai_giang', label: 'Bài giảng' },
                { id: 'da_phuong_tien', label: 'Video / Âm thanh' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-white text-[#163d85] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end lg:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#163d85] shadow-xs' : 'text-slate-500'
                }`}
                title="Chế độ Lưới"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-[#163d85] shadow-xs' : 'text-slate-500'
                }`}
                title="Chế độ Bảng"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Management Resource Display: Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <article
                key={res.id}
                className="bg-white border border-sky-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-sky-300 hover:shadow-md transition-all group"
              >
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getIconForType(res.type)}
                </div>

                {/* Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1 flex-wrap">
                    {res.matrixCode && (
                      <span className="font-mono font-black text-white bg-[#163d85] px-1.5 py-0.5 rounded text-[10px]">
                        {res.matrixCode}
                      </span>
                    )}
                    {res.statusTag === 'needs_production' ? (
                      <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                        Cần sản xuất
                      </span>
                    ) : res.statusTag === 'needs_supplement' ? (
                      <span className="font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded text-[10px]">
                        Cần bổ sung
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                        Đã có tệp gốc
                      </span>
                    )}
                    <span className="font-bold text-[#1686d9] uppercase tracking-wide">
                      {res.topic}
                    </span>
                    <span>·</span>
                    <span>{res.fileSize || '35 KB'}</span>
                    <span>·</span>
                    <span>{res.author}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#203e64] group-hover:text-[#1686d9] transition-colors leading-snug truncate">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-2">
                    <button
                      onClick={() => onSelectResource(res)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1686d9] hover:text-[#163d85] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem trước</span>
                    </button>

                    <span className="text-slate-300">|</span>

                    <button
                      onClick={() => handleDownloadResource(res)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b24] hover:text-[#e05615] transition-colors cursor-pointer"
                      title="Tải tệp học liệu về máy"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về</span>
                    </button>

                    <span className="text-slate-300">|</span>

                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                      title="Sửa thông tin hoặc thay thế tệp"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa / Thay tệp</span>
                    </button>

                    <button
                      onClick={() => setResourceToDelete(res)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer ml-auto"
                      title="Xóa học liệu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">STT</th>
                    <th className="py-3 px-4">Tên học liệu</th>
                    <th className="py-3 px-4">Định dạng</th>
                    <th className="py-3 px-4">Chuyên đề</th>
                    <th className="py-3 px-4">Dung lượng</th>
                    <th className="py-3 px-4">Người đăng</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResources.map((res, idx) => (
                    <tr key={res.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#203e64]">{res.title}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{res.description}</div>
                      </td>
                      <td className="py-3 px-4 font-mono uppercase font-bold text-[11px] text-sky-800">
                        {res.type}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600">
                        {res.topic}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {res.fileSize || '35 KB'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {res.author}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onSelectResource(res)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg cursor-pointer"
                            title="Xem trước"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadResource(res)}
                            className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg cursor-pointer"
                            title="Tải về máy tính"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(res)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                            title="Sửa / Thay tệp"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setResourceToDelete(res)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
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

        {filteredResources.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100/70 text-[#ff6b24] flex items-center justify-center shadow-xs">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">
                {searchQuery ? `Không tìm thấy học liệu nào phù hợp với từ khóa "${searchQuery}".` : 'Chưa có tài liệu nào trong kho quản lý.'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? 'Vui lòng thử tìm với từ khóa khác hoặc xóa bộ lọc.'
                  : 'Thầy/Cô hãy bắt đầu tự tạo học liệu, tự tải tệp Word, PDF, PowerPoint, Video... và tự đặt tên theo ý muốn.'}
              </p>
            </div>
            {!searchQuery && (
              <div className="pt-2">
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:from-[#ea5c16] hover:to-[#ff7b18] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>TẢI LÊN HỌC LIỆU ĐẦU TIÊN</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORM MODAL: ADD / EDIT / REPLACE FILE */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b2446]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-orange-50">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#ff6b24]" />
                <h3 className="font-black text-lg text-[#163d85]">
                  {editingResource ? 'Chỉnh sửa & Thay thế học liệu' : 'Tải lên học liệu mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveResource} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên tài liệu học liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phiếu bài tập đọc hiểu Dế Mèn, Slide bài giảng..."
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

              {/* Topic & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loại học liệu <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ResourceType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium bg-white"
                  >
                    <option value="docx">Văn bản Word (.docx, .doc)</option>
                    <option value="pdf">Tài liệu PDF (.pdf)</option>
                    <option value="pptx">Bài giảng trình chiếu (.pptx, .ppsx)</option>
                    <option value="image">Hình ảnh / Sơ đồ (.png, .jpg)</option>
                    <option value="audio">Âm thanh ghi bài (.mp3, .wav)</option>
                    <option value="video">Bài giảng Video / Minh họa (.mp4, YouTube)</option>
                    <option value="worksheet">Phiếu bài tập / PISA</option>
                    <option value="test_guide">Đề kiểm tra & Hướng dẫn chấm</option>
                  </select>
                </div>
              </div>

              {/* Category & Matrix Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nhóm học liệu
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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mã ma trận (gắn với 13 tiết học)
                  </label>
                  <select
                    value={formMatrixCode}
                    onChange={(e) => setFormMatrixCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium bg-white"
                  >
                    <option value="">(Không gắn mã - Học liệu tự do)</option>
                    <option value="KHBD">KHBD - Kế hoạch bài dạy 13 tiết</option>
                    <option value="BT01">BT01 - Phiếu PISA đọc hiểu (Tiết 2, 3, 4, 7)</option>
                    <option value="BT02">BT02 - Phiếu tiếng Việt (Tiết 5, 6)</option>
                    <option value="KT01">KT01 - Đề kiểm tra tiếng Việt (Tiết 6)</option>
                    <option value="KT02">KT02 - Đề kiểm tra tổng kết 45p (Tiết 13)</option>
                    <option value="BG01">BG01 - Bài giảng e-learning 1: Tri thức Ngữ văn (Tiết 1)</option>
                    <option value="BG02">BG02 - Bài giảng e-learning 2: Đọc hiểu Dế Mèn (Tiết 2, 3, 4)</option>
                    <option value="BG03">BG03 - Bài giảng e-learning 3: Thực hành tiếng Việt (Tiết 5, 6)</option>
                    <option value="VD01">VD01 - Video hỗ trợ học tập / Tình huống (Tiết 1, 4, 7)</option>
                    <option value="DG01">DG01 - Rubric & Bảng kiểm đánh giá (Tiết 8-11, 13)</option>
                  </select>
                </div>
              </div>

              {/* File Upload / Replace File Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">
                    {editingResource ? 'Thay thế tệp học liệu:' : 'Chọn tệp tải lên từ máy tính:'}
                  </span>
                  {formFileName && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Đã chọn: {formFileName} ({formFileSize})
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 hover:border-[#1686d9] rounded-xl text-slate-700 font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs">
                    <Upload className="w-4 h-4 text-[#ff6b24]" />
                    <span>{editingResource ? 'Tải tệp mới để thay thế...' : 'Chọn tệp từ máy...'}</span>
                    <input
                      type="file"
                      accept=".docx,.doc,.pdf,.pptx,.ppsx,.ppt,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.mov,.zip"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Hoặc dán URL liên kết (YouTube, Google Drive, học liệu trực tuyến)..."
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-mono text-[11px] bg-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Hỗ trợ tệp dung lượng lớn trên 50MB (tối đa 500MB) cho video bài giảng MP4, slide trình chiếu và học liệu số.</span>
                </div>

                {uploadProgress !== null && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {isSaving ? `Đang lưu học liệu vào hệ thống: ${uploadProgress}%` : 'Tệp đã sẵn sàng tải lên (100%)'}
                      </span>
                      <span className="text-slate-500 font-mono">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    {!isSaving && selectedFileBlob && (
                      <p className="text-[11px] text-slate-500">
                        Thầy/Cô hãy nhấn nút <strong className="text-[#ff6b24]">"{editingResource ? 'LƯU THAY ĐỔI' : 'LƯU VÀO KHO HỌC LIỆU'}"</strong> bên dưới để hoàn tất lưu trữ.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Content Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết (Hiển thị cho học sinh đọc trực tuyến ngay trong LMS)
                </label>
                <textarea
                  rows={4}
                  placeholder="Dán nội dung giáo án, bài đọc hoặc các câu hỏi ôn tập tại đây..."
                  value={formContentPreview}
                  onChange={(e) => setFormContentPreview(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-normal"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Giáo viên phụ trách / Tác giả
                </label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium"
                />
              </div>

              {/* Submit buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] text-white font-extrabold hover:shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu lên Đám mây...</span>
                    </>
                  ) : editingResource ? (
                    'LƯU THAY ĐỔI'
                  ) : (
                    'LƯU VÀO KHO HỌC LIỆU'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
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
              Bạn có chắc chắn muốn xóa học liệu <strong>"{resourceToDelete.title}"</strong> không? Thao tác này sẽ xóa tệp khỏi kho học liệu và không thể hoàn tác.
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

      {/* BACKUP & RESTORE MODAL */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b2446]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-600" />
                <h3 className="font-black text-lg text-[#163d85]">
                  Sao lưu & Khôi phục Học liệu
                </h3>
              </div>
              <button
                onClick={() => setIsBackupModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Storage note */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-900 leading-relaxed mb-5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý về lưu trữ cục bộ (IndexedDB):</strong> Dữ liệu và tệp tải lên được lưu an toàn trên trình duyệt của thiết bị này. Dữ liệu cục bộ <em>không tự động đồng bộ sang máy tính khác</em> trừ khi kết nối hệ thống đám mây (Firebase Cloud Storage). Hãy thường xuyên xuất tệp sao lưu JSON để lưu trữ dự phòng.
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#163d85] hover:bg-[#12316d] text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>XUẤT TỆP SAO LƯU (.JSON)</span>
              </button>

              <label className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>NHẬP DỮ LIỆU TỪ TỆP JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetToDefault}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục 6 học liệu chuẩn ban đầu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
