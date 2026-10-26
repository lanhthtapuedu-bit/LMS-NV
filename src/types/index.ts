export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
  school?: string;
}

export type ResourceType =
  | 'docx'
  | 'pptx'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'image'
  | 'worksheet'
  | 'test_guide';

export type ResourceCategory =
  | 'ke_hoach'
  | 'phieu_bai_tap'
  | 'de_kiem_tra'
  | 'bai_giang'
  | 'da_phuong_tien'
  | 'khac';

export type ResourceStatusTag = 'available' | 'needs_production' | 'needs_supplement';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  topic: string; // e.g. "Chuyên đề 01", "Chuyên đề 02", "Toàn khóa"
  order: number;
  fileUrl: string; // e.g. "hoc_lieu/01_Ke_hoach_bai_day.docx"
  fileName?: string;
  fileBlobKey?: string;
  fileSize?: string;
  uploadedAt: string;
  author: string;
  contentPreview?: string; // Rich formatted text for in-browser reader
  isOriginal?: boolean;
  matrixCode?: string; // e.g. "BG01", "BG02", "BG03", "BT01", "BT02", "KT01", "KT02", "DG01", "VD01", "KHBD"
  statusTag?: ResourceStatusTag; // "available" (Đã có tệp gốc), "needs_production" (Cần sản xuất), "needs_supplement" (Cần bổ sung)
  associatedPeriods?: number[]; // [1, 2, 3...]
}

export interface LessonPeriod {
  periodNumber: number; // 1 to 13
  title: string;
  strand: string; // Mạch nội dung (e.g. Tri thức Ngữ văn, Đọc, Thực hành tiếng Việt, Viết...)
  contentActivity: string; // Nội dung / Hoạt động
  objectives: string; // Mục tiêu đầu ra
  durationOnline: number; // Thời lượng trực tuyến (phút)
  durationDirect: number; // Thời lượng trực tiếp (phút) - 45
  onlineActivity: string; // Hoạt động trực tuyến trên LMS
  directActivity: string; // Hoạt động trực tiếp trên lớp
  learningResourceCodes: string[]; // e.g. ['BG01', 'BT01']
  learningResourceDesc: string; // Mô tả học liệu số
  evidenceAssessment: string; // Đánh giá / minh chứng
}

export interface LessonObjective {
  type: 'knowledge' | 'skill' | 'quality';
  content: string;
}

export interface LessonData {
  id: string;
  key: string;
  tag: string;
  category: string;
  title: string;
  description: string;
  coverGradient: string;
  icon: string;
  status: string;
  periodRange: string; // e.g. "Tiết 1 – 4", "Tiết 5 – 6"
  totalOnlineMinutes: number; // e.g. 77.14
  totalDirectMinutes: number; // e.g. 180
  periods: LessonPeriod[]; // Detailed breakdown of periods belonging to this module
  objectives: string[];
  tasks: string[];
  product: string;
  contentBody: string;
}

export interface FriendshipMessage {
  id: string;
  author: string;
  content: string;
  tag: string;
  createdAt: string;
  likes: number;
}
