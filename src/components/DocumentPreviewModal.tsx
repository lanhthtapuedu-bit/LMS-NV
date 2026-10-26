import React, { useState, useEffect, useRef } from 'react';
import { ResourceItem } from '../types';
import { storageService } from '../services/storageService';
import {
  X,
  Download,
  FileText,
  Printer,
  Check,
  Copy,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Film,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

// Helper to load PDF.js from CDN once for unblocked <canvas> rendering inside iframes
let pdfJsPromise: Promise<any> | null = null;
function loadPdfJs(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
    return Promise.resolve((window as any).pdfjsLib);
  }
  if (pdfJsPromise) return pdfJsPromise;

  pdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjsLib);
      } else {
        reject(new Error('Không thể khởi tạo PDF.js'));
      }
    };
    script.onerror = () => reject(new Error('Lỗi tải thư viện hiển thị PDF'));
    document.head.appendChild(script);
  });
  return pdfJsPromise;
}

interface DocumentPreviewModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ resource, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(
    resource?.fileUrl && !resource.fileUrl.startsWith('blob:') ? resource.fileUrl : ''
  );
  const [isLoadingFile, setIsLoadingFile] = useState(true);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Canvas PDF Viewer states (100% unblocked in all browsers/iframes)
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfPageNum, setPdfPageNum] = useState<number>(1);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(0);
  const [pdfScale, setPdfScale] = useState<number>(1.35);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    if (resource) {
      const initialUrl = resource.fileUrl && !resource.fileUrl.startsWith('blob:') ? resource.fileUrl : '';
      setPreviewUrl(initialUrl);
      setIsLoadingFile(true);
      setActiveSlide(0);
      setPdfDoc(null);
      setPdfPageNum(1);
      setPdfTotalPages(0);
      setPdfError(null);

      storageService
        .getResourceFileUrl(resource)
        .then(async (url) => {
          if (!active) return;
          if (url) {
            setPreviewUrl(url);
          }

          if (resource.type === 'pdf' && url) {
            try {
              const [pdfjsLib, response] = await Promise.all([loadPdfJs(), fetch(url)]);
              const arrayBuffer = await response.arrayBuffer();
              const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
              const loadedPdf = await loadingTask.promise;
              if (active) {
                setPdfDoc(loadedPdf);
                setPdfTotalPages(loadedPdf.numPages);
                setPdfPageNum(1);
              }
            } catch (err) {
              console.warn('Lỗi đọc PDF qua Canvas:', err);
              if (active) {
                setPdfError('Không thể hiển thị bản xem trước trực tiếp.');
              }
            }
          }

          if (active) {
            setIsLoadingFile(false);
          }
        })
        .catch(() => {
          if (active) setIsLoadingFile(false);
        });
    }
    return () => {
      active = false;
    };
  }, [resource]);

  // Render active PDF page onto <canvas>
  useEffect(() => {
    let cancelled = false;
    let renderTask: any = null;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        const page = await pdfDoc.getPage(pdfPageNum);
        if (cancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: pdfScale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        renderTask = page.render({
          canvasContext: context,
          viewport
        });
        await renderTask.promise;
      } catch (e: any) {
        if (e?.name !== 'RenderingCancelledException') {
          console.warn('Lỗi vẽ trang PDF:', e);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTask && renderTask.cancel) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pdfPageNum, pdfScale]);

  if (!resource) return null;

  const handleDownload = async (format?: 'docx' | 'pdf' | 'pptx' | 'video') => {
    const res = await storageService.downloadResourceFile(resource, format);
    setDownloadMsg(res.message);
    setTimeout(() => setDownloadMsg(null), 3500);
  };

  const handleCopy = () => {
    if (resource.contentPreview) {
      navigator.clipboard.writeText(resource.contentPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Build slides from preview content if PPTX
  const buildSlides = () => {
    const text = resource.contentPreview || resource.description || '';
    const rawChunks = text.split(/\n#{1,3}\s+|(?:\n\n\d+\.\s+)/).filter((c) => c.trim().length > 0);
    if (rawChunks.length > 0) {
      return rawChunks;
    }
    return [
      `CHUYÊN ĐỀ: ${resource.topic}\n\nTác giả: ${resource.author}\n${resource.description}`,
      resource.contentPreview || 'Nội dung bài giảng số đang được cập nhật.'
    ];
  };

  const slides = buildSlides();

  return (
    <div className="fixed inset-0 z-[60] bg-[#0b2446]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-white to-orange-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-xs ${
              resource.type === 'video' ? 'bg-rose-500' : resource.type === 'pptx' ? 'bg-orange-500' : resource.type === 'pdf' ? 'bg-red-500' : 'bg-blue-600'
            }`}>
              {resource.type.toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#1686d9] uppercase tracking-wider">
                {resource.topic} · {resource.author}
              </span>
              <h2 className="text-lg font-black text-[#163d85] leading-snug">
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Preview */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-700 text-sm leading-relaxed">
          {/* File Meta info & Direct Actions */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <span>Định dạng: <strong className="text-[#163d85] uppercase">{resource.type}</strong></span>
              <span>Dung lượng: <strong className="text-[#163d85]">{resource.fileSize || '35 KB'}</strong></span>
              <span>Cập nhật: <strong className="text-[#163d85]">{resource.uploadedAt}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold text-xs cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold text-xs cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In ấn</span>
              </button>
            </div>
          </div>

          {/* ONLINE PPTX PRESENTATION SLIDE VIEWER */}
          {resource.type === 'pptx' && (
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-[#0c2448] to-[#163d85] p-6 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-orange-400" />
                  <span className="font-extrabold text-sm uppercase tracking-wider text-orange-200">
                    Trình chiếu Slide trực tuyến
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-full">
                  <span>Trang {activeSlide + 1} / {slides.length}</span>
                </div>
              </div>

              {/* Current Slide Display */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 min-h-60 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between text-xs text-orange-600 font-black mb-2 uppercase tracking-wide">
                    <span>LMS Ngữ văn 6 · Bài 1</span>
                    <span className="font-mono">SLIDE #{activeSlide + 1}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#163d85] mb-3">
                    {activeSlide === 0 ? resource.title : `Phần ${activeSlide + 1}: Nội dung & Nhiệm vụ`}
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                    {slides[activeSlide]}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{resource.author || 'Tổ bộ môn Ngữ văn'}</span>
                  <span>Mã bài giảng: {resource.matrixCode || 'PPTX'}</span>
                </div>
              </div>

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                  disabled={activeSlide === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>

                <div className="flex gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx ? 'bg-orange-400 scale-125' : 'bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Trang ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                  disabled={activeSlide === slides.length - 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-30 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ONLINE VIDEO PLAYER */}
          {resource.type === 'video' && (
            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-2xl relative border border-slate-800">
              {(previewUrl || resource.fileUrl).includes('youtube') ? (
                <iframe
                  src={previewUrl || resource.fileUrl}
                  title={resource.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full h-full rounded-2xl" poster="/assets/logo-ngu-van.png">
                  <source src={previewUrl || resource.fileUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ thẻ video.
                </video>
              )}
            </div>
          )}

          {/* PDF Viewer (Rendered via HTML5 Canvas - Never blocked by Chrome/Edge!) */}
          {resource.type === 'pdf' && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md flex flex-col">
              {/* PDF Top Action Bar */}
              <div className="px-4 py-2.5 bg-slate-800 text-white flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-bold">Xem trực tuyến tệp PDF ({resource.fileSize || 'Tài liệu'})</span>
                </div>

                {pdfTotalPages > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-700/80 px-2.5 py-1 rounded-lg">
                    <button
                      onClick={() => setPdfPageNum((p) => Math.max(1, p - 1))}
                      disabled={pdfPageNum <= 1}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                      title="Trang trước"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold px-2">
                      Trang {pdfPageNum} / {pdfTotalPages}
                    </span>
                    <button
                      onClick={() => setPdfPageNum((p) => Math.min(pdfTotalPages, p + 1))}
                      disabled={pdfPageNum >= pdfTotalPages}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                      title="Trang sau"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-500 mx-1">|</span>
                    <button
                      onClick={() => setPdfScale((s) => Math.max(0.75, +(s - 0.2).toFixed(2)))}
                      className="p-1 hover:bg-white/10 rounded cursor-pointer"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPdfScale((s) => Math.min(2.5, +(s + 0.2).toFixed(2)))}
                      className="p-1 hover:bg-white/10 rounded cursor-pointer"
                      title="Phóng to"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {previewUrl && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold text-xs transition-colors"
                      title="Mở toàn màn hình trong tab mới"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Mở tab mới ↗</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold text-xs transition-colors cursor-pointer"
                    title="Tải tệp PDF về máy"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải PDF</span>
                  </button>
                </div>
              </div>

              {isLoadingFile ? (
                <div className="h-[460px] bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
                  <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-xs font-semibold text-slate-700">Đang chuẩn bị hiển thị tệp PDF ({resource.fileSize || 'Học liệu'})...</p>
                </div>
              ) : pdfDoc ? (
                <div className="bg-slate-800/90 p-4 overflow-auto max-h-[540px] flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="bg-white shadow-2xl rounded-lg max-w-full h-auto"
                  />
                </div>
              ) : (
                <div className="p-10 text-center bg-white flex flex-col items-center justify-center min-h-[300px]">
                  <FileText className="w-12 h-12 text-red-500 mb-3" />
                  <p className="text-slate-800 font-bold mb-1">Tài liệu PDF: {resource.title}</p>
                  <p className="text-xs text-slate-500 mb-4">
                    {pdfError || resource.description || 'Nhấn nút bên dưới để mở xem trực tiếp hoặc tải tệp PDF gốc về máy.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {previewUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-sm"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Mở xem trong tab mới ↗</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleDownload('pdf')}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải tệp PDF ({resource.fileSize || 'Đầy đủ'}) về máy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audio Player */}
          {resource.type === 'audio' && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-700 text-white shadow-md">
              <h4 className="font-bold text-sm mb-2">Trình phát tệp âm thanh học liệu</h4>
              <p className="text-xs text-sky-100 mb-4">{resource.description}</p>
              <audio controls className="w-full rounded-xl">
                <source src={previewUrl || resource.fileUrl} type="audio/mpeg" />
                Trình duyệt của bạn không hỗ trợ thẻ audio.
              </audio>
            </div>
          )}

          {/* Formatted Content Preview */}
          <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1686d9] mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Nội dung chi tiết tài liệu học tập</span>
            </h4>
            <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800 font-normal">
              {resource.contentPreview || resource.description}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer with Format-Specific Download Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Tải theo định dạng mong muốn:
            </span>
            {downloadMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-in fade-in">
                {downloadMsg}
              </span>
            )}
          </div>

          {/* Download Action Buttons by Format */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownload('docx')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-all cursor-pointer shadow-2xs"
              title="Tải tệp dạng Word (.docx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải DOCX</span>
            </button>

            <button
              onClick={() => handleDownload('pdf')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-all cursor-pointer shadow-2xs"
              title="Tải tệp dạng PDF (.pdf)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải PDF</span>
            </button>

            {resource.type === 'pptx' && (
              <button
                onClick={() => handleDownload('pptx')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 font-bold text-xs rounded-xl border border-orange-200 transition-all cursor-pointer shadow-2xs"
                title="Tải bài giảng PowerPoint (.pptx)"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Tải PPTX</span>
              </button>
            )}

            {resource.type === 'video' && (
              <button
                onClick={() => handleDownload('video')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer shadow-2xs"
                title="Tải video bài giảng (.mp4)"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Tải Video</span>
              </button>
            )}

            <button
              onClick={() => handleDownload()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:from-[#ea5c16] hover:to-[#ff7b18] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer ml-1"
              title="Tải tệp gốc về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span>TẢI TỆP GỐC ↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
