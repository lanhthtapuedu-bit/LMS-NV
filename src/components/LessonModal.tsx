import React, { useState } from 'react';
import { LessonData, ResourceItem, LessonPeriod } from '../types';
import { storageService } from '../services/storageService';
import {
  X,
  CheckCircle,
  Volume2,
  Sparkles,
  Play,
  Pause,
  Download,
  Eye,
  Clock,
  Laptop,
  Users,
  FileText,
  AlertCircle,
  CheckSquare,
  BookOpen,
  Award,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface LessonModalProps {
  lesson: LessonData | null;
  resources?: ResourceItem[];
  onClose: () => void;
  onSelectResource?: (resource: ResourceItem) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  resources = [],
  onClose,
  onSelectResource
}) => {
  const [activeTab, setActiveTab] = useState<'periods' | 'content' | 'interactive' | 'rubric'>('periods');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(0);

  const handleDownloadResource = async (item: ResourceItem, format?: 'docx' | 'pdf' | 'pptx' | 'video') => {
    await storageService.downloadResourceFile(item, format);
  };

  // Interactive state for Lesson 2 (Quiz)
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q1Feedback, setQ1Feedback] = useState<string | null>(null);

  // Interactive state for Lesson 2 (Word sorter)
  const wordsToClassify = [
    { word: 'long lanh', type: 'lay' },
    { word: 'sách vở', type: 'ghep' },
    { word: 'thoăn thoắt', type: 'lay' },
    { word: 'bạn bè', type: 'ghep' },
    { word: 'rón rén', type: 'lay' },
    { word: 'thầy cô', type: 'ghep' }
  ];
  const [userSorted, setUserSorted] = useState<Record<string, 'ghep' | 'lay'>>({});

  // Interactive state for Lesson 3 (Writing Scratchpad)
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftSavedMessage, setDraftSavedMessage] = useState(false);

  // Interactive state for Lesson 4 (Speaking Timer)
  const [timerSeconds, setTimerSeconds] = useState(150); // 2:30
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Interactive state for Lesson 5 (Friendship message)
  const [authorName, setAuthorName] = useState('');
  const [friendshipNote, setFriendshipNote] = useState('');
  const [friendshipCards, setFriendshipCards] = useState([
    { id: 1, author: 'Minh Tuấn (6A)', note: 'Cảm ơn cậu đã luôn nhắc bài tập về nhà giúp mình!', likes: 5 },
    { id: 2, author: 'Hồng Ánh (6C)', note: 'Đừng ngại vì mình khác biệt, mỗi người chúng ta đều là một vì sao lấp lánh!', likes: 11 }
  ]);

  // Interactive state for Lesson 6 (Assessment quiz)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [rubricCopied, setRubricCopied] = useState(false);

  // Audio reader simulation using Web Speech Synthesis API
  const [isReadingAudio, setIsReadingAudio] = useState(false);

  if (!lesson) return null;

  const handleCopyRubric = () => {
    const rubricText = `BẢNG KIỂM & RUBRIC ĐÁNH GIÁ (MÃ DG01)
Chuyên đề: ${lesson.title} (${lesson.periodRange})
1. Nhận biết và hiểu đúng kiến thức thể loại, ngôn ngữ: Tốt
2. Vận dụng kiến thức vào thực hành bài tập & viết câu: Đạt
3. Tinh thần tự học trực tuyến trên LMS (30% thời lượng - 250,71p toàn khóa): Tốt
4. Tham gia thảo luận và hợp tác trực tiếp trên lớp (70% thời lượng - 585p toàn khóa): Tốt`;
    navigator.clipboard.writeText(rubricText);
    setRubricCopied(true);
    setTimeout(() => setRubricCopied(false), 2000);
  };

  const handlePrintRubric = () => {
    window.print();
  };

  const currentPeriod: LessonPeriod | undefined = lesson.periods?.[selectedPeriodIndex] || lesson.periods?.[0];

  const handleReadText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Trình duyệt không hỗ trợ Web Speech Synthesis.');
      return;
    }
    if (isReadingAudio) {
      window.speechSynthesis.cancel();
      setIsReadingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsReadingAudio(false);
    utterance.onerror = () => setIsReadingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsReadingAudio(true);
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReadingAudio(false);
  };

  const checkQ1 = () => {
    if (!q1Selected) {
      setQ1Feedback('Vui lòng chọn một đáp án trước khi kiểm tra.');
      return;
    }
    if (q1Selected === 'b') {
      setQ1Feedback('Chính xác! "Long lanh" là từ láy vì có sự lặp lại phụ âm đầu "l".');
    } else {
      setQ1Feedback('Chưa chính xác. "Học sinh" và "bàn ghế" là các từ ghép vì các tiếng kết hợp với nhau về mặt ý nghĩa.');
    }
  };

  const assessmentQuestions = [
    {
      id: 1,
      question: 'Văn bản "Bài học đường đời đầu tiên" được kể theo ngôi thứ mấy?',
      options: [
        { key: 'A', text: 'Ngôi thứ nhất (nhân vật "tôi" - Dế Mèn xưng tôi)' },
        { key: 'B', text: 'Ngôi thứ hai' },
        { key: 'C', text: 'Ngôi thứ ba (người kể chuyện giấu mình)' },
        { key: 'D', text: 'Kết hợp linh hoạt cả ngôi thứ nhất và thứ ba' }
      ],
      correct: 'A'
    },
    {
      id: 2,
      question: 'Nhân vật Dế Mèn trong truyện có ngoại hình như thế nào?',
      options: [
        { key: 'A', text: 'Gầy gò, yếu ớt, cánh ngắn củn' },
        { key: 'B', text: 'Khỏe mạnh, mẫm bóng, đôi vuốt cứng và nhọn hoắt' },
        { key: 'C', text: 'Chậm chạp, nhút nhát và hiền lành' },
        { key: 'D', text: 'To lớn nhưng lười biếng' }
      ],
      correct: 'B'
    },
    {
      id: 3,
      question: 'Từ nào sau đây là TỪ LÁY?',
      options: [
        { key: 'A', text: 'Sách vở' },
        { key: 'B', text: 'Bàn ghế' },
        { key: 'C', text: 'Rón rén' },
        { key: 'D', text: 'Học hỏi' }
      ],
      correct: 'C'
    },
    {
      id: 4,
      question: 'Bài học sâu sắc nhất mà Dế Mèn rút ra sau cái chết của Dế Choắt là gì?',
      options: [
        { key: 'A', text: 'Không nên chơi với những người yếu đuối hơn mình' },
        { key: 'B', text: 'Không được hung hăng, hống hách; làm việc gì cũng phải suy nghĩ chín chắn' },
        { key: 'C', text: 'Nên đào hang thật sâu để trốn chị Cốc' },
        { key: 'D', text: 'Cần chăm chỉ tập thể dục để khỏe mạnh' }
      ],
      correct: 'B'
    }
  ];

  // Helper to find matching resources for the current period
  const getPeriodResources = (codes: string[]) => {
    return resources.filter((r) => r.matrixCode && codes.includes(r.matrixCode));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b2446]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-white to-orange-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-widest text-[#1686d9] uppercase bg-sky-100/70 px-2.5 py-0.5 rounded-md">
                {lesson.tag} · {lesson.category}
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {lesson.periodRange}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#163d85] leading-tight mt-1">
              {lesson.title}
            </h2>
          </div>

          <button
            onClick={() => {
              handleStopAudio();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('periods')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'periods'
                ? 'border-[#ff6b24] text-[#ff6b24]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chi tiết các tiết học ({lesson.periodRange})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'border-[#ff6b24] text-[#ff6b24]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tri thức & Hướng dẫn đọc</span>
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'interactive'
                ? 'border-[#ff6b24] text-[#ff6b24]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Hoạt động tương tác</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'rubric'
                ? 'border-[#ff6b24] text-[#ff6b24]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Bảng kiểm & Rubric (DG01)</span>
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: 13-PERIOD MATRIX BREAKDOWN */}
          {activeTab === 'periods' && (
            <div className="space-y-6">
              {/* Period Selector Tabs (for modules having multiple periods) */}
              {lesson.periods && lesson.periods.length > 1 && (
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
                  {lesson.periods.map((p, idx) => (
                    <button
                      key={p.periodNumber}
                      onClick={() => setSelectedPeriodIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        selectedPeriodIndex === idx
                          ? 'bg-white text-[#163d85] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tiết {p.periodNumber}
                    </button>
                  ))}
                </div>
              )}

              {currentPeriod && (
                <div className="space-y-6">
                  {/* Period Banner & Blended Learning Metric */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-orange-50/60 border border-sky-100 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#1686d9]">
                          Mạch nội dung: {currentPeriod.strand}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[#163d85] mt-0.5">
                          {currentPeriod.title}
                        </h3>
                      </div>

                      {/* Blended Learning Exact Duration Badge */}
                      <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-sky-200 shadow-xs self-start sm:self-auto shrink-0">
                        <Clock className="w-4 h-4 text-[#ff6b24]" />
                        <div className="text-[11px] font-bold">
                          <span className="text-[#ff6b24]">Trực tuyến: {currentPeriod.durationOnline}p (30%)</span>
                          <span className="mx-1.5 text-slate-300">|</span>
                          <span className="text-[#163d85]">Trực tiếp: {currentPeriod.durationDirect}p (70%)</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      <strong>Nội dung trọng tâm:</strong> {currentPeriod.contentActivity}
                    </p>
                  </div>

                  {/* 1. Yêu cầu cần đạt (Mục tiêu đầu ra) */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1686d9]">
                      <CheckCircle className="w-4 h-4 text-[#1686d9]" />
                      <span>Yêu cầu cần đạt (Mục tiêu đầu ra)</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold pl-6">
                      {currentPeriod.objectives}
                    </p>
                  </div>

                  {/* 2. Hai trụ cột hoạt động: Trực tuyến (LMS) & Trực tiếp (Trên lớp) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Trực tuyến (30%) */}
                    <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ea5c16]">
                          <Laptop className="w-4 h-4 text-[#ff6b24]" />
                          <span>Hoạt động trực tuyến (LMS)</span>
                        </div>
                        <span className="text-[10px] font-black text-[#ea5c16] bg-white px-2 py-0.5 rounded-md border border-orange-200">
                          30% ({currentPeriod.durationOnline} phút)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {currentPeriod.onlineActivity}
                      </p>
                    </div>

                    {/* Trực tiếp (70%) */}
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#163d85]">
                          <Users className="w-4 h-4 text-[#163d85]" />
                          <span>Hoạt động trực tiếp trên lớp</span>
                        </div>
                        <span className="text-[10px] font-black text-[#163d85] bg-white px-2 py-0.5 rounded-md border border-blue-200">
                          70% ({currentPeriod.durationDirect} phút)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {currentPeriod.directActivity}
                      </p>
                    </div>
                  </div>

                  {/* 3. Học liệu số tương ứng theo ma trận (BG01, BT01, KT01, DG01...) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                        <FileText className="w-4 h-4 text-[#1686d9]" />
                        <span>Học liệu số gắn với tiết học (Theo ma trận)</span>
                      </div>
                      <div className="flex gap-1">
                        {currentPeriod.learningResourceCodes.map((code) => (
                          <span
                            key={code}
                            className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#163d85]"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Danh mục học liệu:</strong> {currentPeriod.learningResourceDesc}
                    </p>

                    {/* List of related items from resources */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {getPeriodResources(currentPeriod.learningResourceCodes).length > 0 ? (
                        getPeriodResources(currentPeriod.learningResourceCodes).map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between hover:border-sky-300 transition-colors"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-sky-50 text-[#1686d9] border border-sky-100">
                                  {item.matrixCode}
                                </span>
                                {item.statusTag === 'needs_production' ? (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    Cần sản xuất
                                  </span>
                                ) : item.statusTag === 'needs_supplement' ? (
                                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                    Cần bổ sung
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    Đã có tệp gốc
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-xs text-[#203e64] line-clamp-1">
                                {item.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                {item.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                              {onSelectResource && (
                                <button
                                  onClick={() => onSelectResource(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-[#1686d9] hover:bg-sky-100 font-extrabold text-[11px] transition-colors cursor-pointer"
                                  title="Xem trước trực tuyến (Video / Slide / Tài liệu)"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{item.type === 'video' ? 'Xem Video' : item.type === 'pptx' ? 'Xem Slide' : 'Xem trực tuyến'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDownloadResource(item, 'docx')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors cursor-pointer"
                                title="Tải tệp định dạng Word DOCX"
                              >
                                <Download className="w-3 h-3" />
                                <span>Tải DOCX</span>
                              </button>

                              <button
                                onClick={() => handleDownloadResource(item, 'pdf')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px] transition-colors cursor-pointer"
                                title="Tải tệp định dạng PDF"
                              >
                                <Download className="w-3 h-3" />
                                <span>Tải PDF</span>
                              </button>

                              {item.type === 'pptx' && (
                                <button
                                  onClick={() => handleDownloadResource(item, 'pptx')}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold text-[11px] transition-colors cursor-pointer"
                                  title="Tải bài giảng PowerPoint PPTX"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Tải PPTX</span>
                                </button>
                              )}

                              {item.type === 'video' && (
                                <button
                                  onClick={() => handleDownloadResource(item, 'video')}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition-colors cursor-pointer"
                                  title="Tải tệp Video MP4"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Tải Video</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center">
                          <p className="text-xs text-slate-500 font-medium">
                            Chưa có tệp học liệu nào được liên kết cho tiết học này.
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Thầy/Cô có thể tải lên tệp mới và chọn mã tương ứng ({currentPeriod.learningResourceCodes.join(', ')}) qua mục Quản lý học liệu.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Đánh giá & Minh chứng sản phẩm */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Đánh giá / Minh chứng sản phẩm học sinh cần nộp</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold pl-6">
                      {currentPeriod.evidenceAssessment}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEXTBOOK CONTENT & TEACHING GUIDE */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Audio reading assist bar */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1686d9] text-white flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#163d85]">
                      Trợ lý đọc diễn cảm trực quan
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Bấm nghe bài giảng diễn giải tóm tắt kiến thức của chuyên đề này
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleReadText(
                      lesson.title + '. ' + lesson.description + '. ' + lesson.contentBody.replace(/[#*]/g, '')
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    isReadingAudio
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-[#1686d9] border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  {isReadingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isReadingAudio ? 'Dừng đọc' : 'Nghe diễn cảm'}</span>
                </button>
              </div>

              {/* Formatted body */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 whitespace-pre-line text-slate-800 font-normal leading-relaxed text-xs sm:text-sm">
                {lesson.contentBody}
              </div>

              {/* Tasks & Deliverable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>📌 Nhiệm vụ học tập chuyên đề</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {lesson.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-amber-700">{idx + 1}.</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🏆 Sản phẩm cần hoàn thành</span>
                  </h4>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {lesson.product}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-2">
                    Nộp sản phẩm lên hệ thống LMS hoặc trao đổi cùng bạn bè trong giờ học trực tiếp.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE ACTIVITIES (DIVERSIFIED FOR EACH MODULE) */}
          {activeTab === 'interactive' && (
            <div className="space-y-6">
              {/* Chuyên đề 1: Đọc hiểu - Bảng so sánh Dế Mèn vs Dế Choắt */}
              {lesson.key === 'reading' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-[#163d85]">
                    Khám phá nhân vật: Dế Mèn và Dế Choắt (Tiết 3)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🦗</span>
                        <h4 className="font-bold text-[#163d85]">Dế Mèn</h4>
                      </div>
                      <ul className="text-xs space-y-2 text-slate-700">
                        <li><strong>Ngoại hình:</strong> Cường tráng, càng mẫm bóng, vuốt nhọn, râu dài uốn cong.</li>
                        <li><strong>Tính nết:</strong> Tự đắc, ngạo nghễ, xem thường bạn yếu hơn.</li>
                        <li><strong>Hành động:</strong> Trêu chọc chị Cốc gây ra cái chết oan cho Choắt.</li>
                        <li className="text-rose-700 font-semibold"><strong>Hậu quả:</strong> Ân hận suốt đời và rút ra bài học đường đời đầu tiên.</li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🦗</span>
                        <h4 className="font-bold text-amber-900">Dế Choắt</h4>
                      </div>
                      <ul className="text-xs space-y-2 text-slate-700">
                        <li><strong>Ngoại hình:</strong> Gầy gò, ốm yếu, cánh ngắn ngủn, chân như que tăm.</li>
                        <li><strong>Tính nết:</strong> Hiền lành, khiêm nhường, nhẫn nại.</li>
                        <li><strong>Ứng xử:</strong> Kính trọng và thật thà nhờ Dế Mèn giúp đào ngách.</li>
                        <li className="text-emerald-700 font-semibold"><strong>Lời trăn trối:</strong> Lời khuyên chân thành giúp Dế Mèn thức tỉnh.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Chuyên đề 2: Tiếng Việt - Quick Quiz + Interactive Sorter */}
              {lesson.key === 'vietnamese' && (
                <div className="space-y-6">
                  {/* Quick question */}
                  <div className="p-5 bg-sky-50/80 rounded-2xl border border-sky-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#1686d9] mb-3">
                      Câu hỏi kiểm tra nhanh (Tiết 5)
                    </h4>
                    <p className="font-semibold text-slate-800 text-sm mb-3">
                      1. Từ nào sau đây là TỪ LÁY?
                    </p>
                    <div className="space-y-2 mb-4">
                      {[
                        { key: 'a', label: 'học sinh' },
                        { key: 'b', label: 'long lanh' },
                        { key: 'c', label: 'bàn ghế' }
                      ].map((opt) => (
                        <label
                          key={opt.key}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-sky-300"
                        >
                          <input
                            type="radio"
                            name="q1"
                            value={opt.key}
                            checked={q1Selected === opt.key}
                            onChange={() => setQ1Selected(opt.key)}
                            className="text-[#ff6b24] focus:ring-[#ff6b24]"
                          />
                          <span className="text-xs font-semibold">{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={checkQ1}
                        className="px-4 py-2 bg-[#1686d9] hover:bg-[#126bb0] text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        KIỂM TRA ĐÁP ÁN
                      </button>
                      {q1Feedback && (
                        <span
                          className={`text-xs font-bold ${
                            q1Selected === 'b' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {q1Feedback}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sorter */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                      Thử thách phân loại từ: Từ ghép hay Từ láy?
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Bấm vào loại từ phù hợp cho mỗi từ dưới đây:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {wordsToClassify.map((item) => {
                        const currentChoice = userSorted[item.word];
                        const isCorrect = currentChoice === item.type;
                        return (
                          <div
                            key={item.word}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between"
                          >
                            <span className="font-bold text-sm text-[#163d85] mb-2">
                              {item.word}
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() =>
                                  setUserSorted({ ...userSorted, [item.word]: 'ghep' })
                                }
                                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                  currentChoice === 'ghep'
                                    ? isCorrect
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-rose-500 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                Từ ghép
                              </button>
                              <button
                                onClick={() =>
                                  setUserSorted({ ...userSorted, [item.word]: 'lay' })
                                }
                                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                  currentChoice === 'lay'
                                    ? isCorrect
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-rose-500 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                Từ láy
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Chuyên đề 3: Viết - Drafting Studio */}
              {lesson.key === 'writing' && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-1">
                      Xưởng viết trực tuyến (Writing Studio - Tiết 9, 10)
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Ghi lại bản nháp bài văn kể lại một trải nghiệm của em với bạn bè:
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nhan đề bài văn (Ví dụ: Chuyến cắm trại đáng nhớ, Bài học từ một hiểu lầm...)"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 focus:outline-hidden"
                    />

                    <textarea
                      rows={8}
                      placeholder="Mở bài: Giới thiệu trải nghiệm...
Thân bài: Kể lại diễn biến sự việc theo trình tự...
Kết bài: Nêu bài học và cảm xúc của bản thân..."
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      className="w-full p-4 rounded-xl border border-slate-200 text-xs leading-relaxed focus:border-emerald-500 focus:outline-hidden font-normal"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Số từ: {draftContent.trim() ? draftContent.trim().split(/\s+/).length : 0} từ
                      </span>

                      <button
                        onClick={() => {
                          setDraftSavedMessage(true);
                          setTimeout(() => setDraftSavedMessage(false), 3000);
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                      >
                        LƯU BẢN NHÁP VÀO HỒ SƠ
                      </button>
                    </div>

                    {draftSavedMessage && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                        Đã lưu bản nháp vào hệ thống học tập của bạn thành công!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chuyên đề 4: Nói và nghe - Timer */}
              {lesson.key === 'speaking' && (
                <div className="space-y-5">
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 text-center space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900">
                      Đồng hồ bấm giờ luyện nói (Mục tiêu: 2 - 3 phút - Tiết 11)
                    </h4>

                    <div className="text-4xl sm:text-5xl font-mono font-black text-[#163d85]">
                      {Math.floor(timerSeconds / 60)}:
                      {(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-extrabold text-white cursor-pointer ${
                          isTimerRunning ? 'bg-amber-500' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {isTimerRunning ? 'TẠM DỪNG' : 'BẮT ĐẦU NÓI'}
                      </button>

                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(150);
                        }}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Đặt lại (2:30)
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Gợi ý: Dành 30 giây mở đầu giới thiệu, 1 phút 30 giây kể diễn biến chính, và 30 giây kết luận bài học.
                    </p>
                  </div>
                </div>
              )}

              {/* Chuyên đề 5: Đọc mở rộng - Friendship Board */}
              {lesson.key === 'friends' && (
                <div className="space-y-6">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 mb-1">
                      Bức tường thông điệp tình bạn (Tiết 7)
                    </h4>
                    <p className="text-xs text-rose-800">
                      Gửi một lời chúc hoặc chia sẻ cảm nghĩ về tình bạn với các bạn cùng lớp:
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <input
                      type="text"
                      placeholder="Tên của bạn (hoặc biệt danh)"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden"
                    />

                    <textarea
                      rows={3}
                      placeholder="Viết thông điệp tình bạn của bạn tại đây..."
                      value={friendshipNote}
                      onChange={(e) => setFriendshipNote(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden"
                    />

                    <button
                      onClick={() => {
                        if (friendshipNote.trim()) {
                          setFriendshipCards([
                            {
                              id: Date.now(),
                              author: authorName.trim() || 'Một người bạn ẩn danh',
                              note: friendshipNote.trim(),
                              likes: 1
                            },
                            ...friendshipCards
                          ]);
                          setFriendshipNote('');
                        }
                      }}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      GỬI THÔNG ĐIỆP
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {friendshipCards.map((c) => (
                      <div key={c.id} className="p-4 bg-white rounded-2xl border border-rose-100 shadow-xs">
                        <p className="text-xs text-slate-700 italic mb-3">"{c.note}"</p>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                          <span className="text-[#1686d9]">{c.author}</span>
                          <span className="text-rose-500">❤️ {c.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chuyên đề 6: Assessment Quiz */}
              {lesson.key === 'assessment' && (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-1">
                      Bài kiểm tra trắc nghiệm tổng kết Bài 1 (Tiết 12 – 13)
                    </h4>
                    <p className="text-xs text-amber-800">
                      Hãy chọn đáp án đúng nhất cho các câu hỏi sau để tự đánh giá năng lực:
                    </p>
                  </div>

                  <div className="space-y-4">
                    {assessmentQuestions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="font-bold text-xs text-[#163d85] mb-2.5">
                          Câu {idx + 1}: {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt) => {
                            const isChosen = quizAnswers[q.id] === opt.key;
                            const isCorrect = q.correct === opt.key;
                            return (
                              <label
                                key={opt.key}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                                      : isChosen
                                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                                      : 'bg-white border-slate-100 text-slate-600'
                                    : isChosen
                                    ? 'bg-sky-50 border-sky-400 font-semibold text-sky-900'
                                    : 'bg-white border-slate-200 hover:border-sky-200 text-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`quiz-${q.id}`}
                                  value={opt.key}
                                  checked={isChosen}
                                  onChange={() =>
                                    !quizSubmitted &&
                                    setQuizAnswers({ ...quizAnswers, [q.id]: opt.key })
                                  }
                                  disabled={quizSubmitted}
                                  className="mt-0.5 text-[#ff6b24]"
                                />
                                <span>
                                  <strong>{opt.key}.</strong> {opt.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="px-5 py-2.5 bg-[#ff6b24] hover:bg-[#ea5c16] text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      NỘP BÀI KIỂM TRA
                    </button>

                    {quizSubmitted && (
                      <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                        Kết quả:{' '}
                        {
                          assessmentQuestions.filter((q) => quizAnswers[q.id] === q.correct).length
                        }
                        /{assessmentQuestions.length} câu đúng!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OBJECTIVES & RUBRIC DG01 */}
          {activeTab === 'rubric' && (
            <div className="space-y-6">
              <div className="p-5 bg-sky-50/70 rounded-2xl border border-sky-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#1686d9] mb-3">
                  Yêu cầu cần đạt chuẩn năng lực chương trình GDPT 2018
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Bảng kiểm tự đánh giá & Rubric (Mã DG01)
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1 inline-block">
                      Chuẩn hóa theo ma trận
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={handleCopyRubric}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      {rubricCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{rubricCopied ? 'Đã sao chép' : 'Sao chép tiêu chí'}</span>
                    </button>
                    <button
                      onClick={handlePrintRubric}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In bảng kiểm</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-white">
                        <th className="py-2.5 px-3 font-bold">Tiêu chí đánh giá</th>
                        <th className="py-2.5 px-3 font-bold text-center">Chưa đạt</th>
                        <th className="py-2.5 px-3 font-bold text-center">Đạt</th>
                        <th className="py-2.5 px-3 font-bold text-center">Tốt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-3 px-3 font-semibold">1. Nhận biết và hiểu đúng kiến thức thể loại, ngôn ngữ</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold">2. Vận dụng kiến thức vào thực hành bài tập & viết câu</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold">3. Tinh thần tự học trực tuyến trên LMS (30% thời lượng)</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold">4. Tham gia thảo luận và hợp tác trực tiếp trên lớp (70% thời lượng)</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-slate-400">○</td>
                        <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Khóa học Ngữ văn 6 · Bài 1: Tôi và các bạn · Phân bổ Blended Learning: 250,71p trực tuyến / 585p trực tiếp
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleStopAudio();
                onClose();
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
