import { LessonData, ResourceItem, FriendshipMessage } from '../types';

export const INITIAL_RESOURCES: ResourceItem[] = [];

export const DEMO_TEMPLATE_RESOURCES: ResourceItem[] = [
  {
    id: 'res-khbd',
    title: 'Kế hoạch bài dạy (Giáo án 13 tiết) Bài 1',
    description: 'Khung mục tiêu năng lực, tiến trình dạy học kết hợp Blended Learning (30% trực tuyến - 70% trực tiếp) chuẩn 13 tiết Bài 1: Tôi và các bạn.',
    type: 'docx',
    category: 'ke_hoach',
    topic: 'Toàn khóa học',
    order: 1,
    fileUrl: '/hoc_lieu/01_Ke_hoach_bai_day.docx',
    fileName: '01_Ke_hoach_bai_day.docx',
    fileSize: '42 KB',
    uploadedAt: '2026-10-20',
    author: 'Tổ Ngữ văn K51',
    isOriginal: true,
    matrixCode: 'KHBD',
    statusTag: 'available',
    associatedPeriods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    contentPreview: `### KẾ HOẠCH BÀI DẠY: BÀI 1 - TÔI VÀ CÁC BẠN (13 TIẾT)
**Bộ sách:** Kết nối tri thức với cuộc sống - Môn: Ngữ văn 6
**Mô hình:** Dạy học kết hợp (Blended Learning: 250,71 phút trực tuyến trên LMS + 585 phút trực tiếp trên lớp)

#### I. PHÂN PHỐI CHƯƠNG TRÌNH 13 TIẾT:
- **Tiết 1:** Tri thức Ngữ văn (Đồng thoại, nhân vật, cốt truyện, người kể chuyện).
- **Tiết 2:** Đọc văn bản "Bài học đường đời đầu tiên" (Đọc, tác giả, tác phẩm, ngôi kể).
- **Tiết 3:** Đọc văn bản "Bài học đường đời đầu tiên" (Phân tích nhân vật Dế Mèn, Dế Choắt).
- **Tiết 4:** Đọc văn bản "Bài học đường đời đầu tiên" (Trêu chị Cốc, hậu quả, bài học).
- **Tiết 5:** Thực hành tiếng Việt (Từ đơn, từ phức; phân biệt từ ghép và từ láy).
- **Tiết 6:** Thực hành tiếng Việt (Nghĩa của từ ngữ và tác dụng của từ láy trong ngữ cảnh).
- **Tiết 7:** Đọc mở rộng trong chủ đề (Tình bạn và cách ứng xử).
- **Tiết 8:** Viết: Kể lại một trải nghiệm của bản thân (Tìm ý, chọn sự việc).
- **Tiết 9:** Viết: Kể lại một trải nghiệm của bản thân (Lập dàn ý và viết bản nháp).
- **Tiết 10:** Viết: Kể lại một trải nghiệm của bản thân (Chỉnh sửa và hoàn thiện theo rubric).
- **Tiết 11:** Nói và nghe: Kể lại một trải nghiệm đáng nhớ & Lắng nghe tích cực.
- **Tiết 12:** Củng cố, mở rộng chủ đề "Tôi và các bạn" (Hệ thống hóa bằng sơ đồ).
- **Tiết 13:** Đánh giá và phản hồi kết quả học tập Bài 1 (Kiểm tra tổng kết).`
  },
  {
    id: 'res-bt01',
    title: 'BT01: Phiếu bài tập phát triển năng lực đọc hiểu PISA',
    description: 'Phiếu học tập 3 cấp độ (Thu nhận thông tin, Tích hợp & Suy luận, Phản ánh & Đánh giá) bám sát ma trận đọc hiểu Bài 1.',
    type: 'docx',
    category: 'phieu_bai_tap',
    topic: 'Chuyên đề 01: Đọc hiểu',
    order: 2,
    fileUrl: '/hoc_lieu/02_Phieu_bai_tap_PISA.docx',
    fileName: '02_Phieu_bai_tap_PISA.docx',
    fileSize: '36 KB',
    uploadedAt: '2026-10-21',
    author: 'Cô Thu Hiếu',
    isOriginal: true,
    matrixCode: 'BT01',
    statusTag: 'available',
    associatedPeriods: [2, 3, 4, 7],
    contentPreview: `### BT01: PHIẾU BÀI TẬP PHÁT TRIỂN NĂNG LỰC ĐỌC HIỂU (ĐỊNH HƯỚNG PISA)
**Văn bản:** Bài học đường đời đầu tiên (Tô Hoài) - Gắn với Tiết 2, 3, 4, 7

#### PHẦN 1: THU NHẬN THÔNG TIN (ACCESS AND RETRIEVE)
- **Câu 1:** Xác định ngôi kể và người kể chuyện trong văn bản. Nêu tác dụng của ngôi kể thứ nhất.
- **Câu 2:** Tìm 4 chi tiết miêu tả ngoại hình và cử chỉ thể hiện vẻ khỏe mạnh, kiêu hãnh của Dế Mèn.

#### PHẦN 2: TÍCH HỢP VÀ SUY LUẬN (INTEGRATE AND INTERPRET)
- **Câu 3:** Hành động trêu chị Cốc bắt nguồn từ nét tính cách nào của Dế Mèn?
- **Câu 4:** Khi chứng kiến Dế Choắt bị chị Cốc mổ chết, tâm trạng Dế Mèn chuyển biến như thế nào?

#### PHẦN 3: PHẢN ÁNH VÀ ĐÁNH GIÁ (REFLECT AND EVALUATE)
- **Câu 5:** Rút ra bài học đường đời đầu tiên cho bản thân về thái độ sống khiêm tốn và trách nhiệm với hành động của mình.`
  },
  {
    id: 'res-bt02',
    title: 'BT02: Phiếu thực hành tiếng Việt (Từ đơn, từ phức, từ láy)',
    description: 'Hệ thống bài tập phân loại từ ngữ, giải thích nghĩa và phân tích giá trị biểu đạt của từ láy trong ngữ cảnh.',
    type: 'docx',
    category: 'phieu_bai_tap',
    topic: 'Chuyên đề 02: Tiếng Việt',
    order: 3,
    fileUrl: '/hoc_lieu/05_Phieu_bai_tap_tieng_Viet.docx',
    fileName: '05_Phieu_bai_tap_tieng_Viet.docx',
    fileSize: '32 KB',
    uploadedAt: '2026-10-22',
    author: 'Cô Kim Xuyến',
    isOriginal: true,
    matrixCode: 'BT02',
    statusTag: 'available',
    associatedPeriods: [5, 6],
    contentPreview: `### BT02: PHIẾU THỰC HÀNH TIẾNG VIỆT
**Chủ đề:** Từ đơn, từ phức, từ ghép, từ láy & nghĩa của từ trong ngữ cảnh - Gắn với Tiết 5, 6

#### I. BÀI TẬP NHẬN BIẾT & PHÂN LOẠI
1. Phân loại các từ sau thành 2 nhóm Từ ghép và Từ láy: *phanh phách, mẫm bóng, vuốt nhọn, rung rinh, hống hách, bạn bè*.
2. Chỉ ra tiếng gốc và tiếng láy trong các từ láy trên.

#### II. BÀI TẬP VẬN DỤNG & TẠO LẬP
3. Giải thích nghĩa của từ "nhũn nhặn" trong câu: "Tôi nhũn nhặn cười chào".
4. Viết đoạn văn ngắn 3-5 câu tả cảnh một buổi sinh hoạt lớp có sử dụng ít nhất 2 từ láy.`
  },
  {
    id: 'res-kt01',
    title: 'KT01: Đề kiểm tra thường xuyên tiếng Việt (15 phút)',
    description: 'Đề kiểm tra đánh giá thường xuyên năng lực tiếng Việt, có đáp án, biểu điểm và hướng dẫn chấm theo chuẩn ma trận.',
    type: 'docx',
    category: 'de_kiem_tra',
    topic: 'Chuyên đề 02: Tiếng Việt',
    order: 4,
    fileUrl: '/hoc_lieu/06_De_kiem_tra_tieng_Viet.docx',
    fileName: '06_De_kiem_tra_tieng_Viet.docx',
    fileSize: '28 KB',
    uploadedAt: '2026-10-23',
    author: 'Cô Kim Xuyến',
    isOriginal: true,
    matrixCode: 'KT01',
    statusTag: 'available',
    associatedPeriods: [5, 6],
    contentPreview: `### KT01: ĐỀ KIỂM TRA THƯỜNG XUYÊN TIẾNG VIỆT
**Thời gian:** 15 phút - Môn: Ngữ văn 6 - Gắn với Tiết 5, 6

#### ĐỀ BÀI (10.0 điểm):
- **Câu 1 (3.0đ):** Điền các từ sau vào bảng phân loại: *gọn gàng, sách vở, thoăn thoắt, bàn ghế, lung linh, bạn học*.
- **Câu 2 (3.0đ):** Nêu tác dụng gợi cảm của hệ thống từ láy khi Tô Hoài miêu tả chàng Dế Mèn.
- **Câu 3 (4.0đ):** Đặt câu với từ láy "bỡ ngỡ" để thể hiện cảm xúc trong ngày đầu tựu trường.`
  },
  {
    id: 'res-kt02',
    title: 'KT02: Đề kiểm tra tổng kết đọc hiểu và viết Bài 1',
    description: 'Đề kiểm tra tổng kết định kỳ Bài 1 gồm phần Đọc hiểu (6.0đ) và Viết bài văn (4.0đ), có ma trận, đặc tả và hướng dẫn chấm.',
    type: 'docx',
    category: 'de_kiem_tra',
    topic: 'Chuyên đề 06: Đánh giá',
    order: 5,
    fileUrl: '/hoc_lieu/03_De_kiem_tra_tong_ket.docx',
    fileName: '03_De_kiem_tra_tong_ket.docx',
    fileSize: '45 KB',
    uploadedAt: '2026-10-23',
    author: 'Thầy Tú Lành',
    isOriginal: true,
    matrixCode: 'KT02',
    statusTag: 'available',
    associatedPeriods: [13],
    contentPreview: `### KT02: ĐỀ KIỂM TRA TỔNG KẾT ĐỌC HIỂU & VIẾT BÀI 1
**Thời gian:** 45 phút - Gắn với Tiết 13

#### PHẦN I: ĐỌC HIỂU (6.0 điểm)
- Đọc văn bản ngoài SGK cùng chủ đề truyện đồng thoại và trả lời 5 câu hỏi phát triển năng lực đọc hiểu.

#### PHẦN II: VIẾT (4.0 điểm)
- Viết bài văn ngắn (khoảng 1 trang giấy thi) kể lại một trải nghiệm đáng nhớ giữa em và một người bạn thân thiết.`
  },
  {
    id: 'res-bg01-slide',
    title: 'Slide bài giảng điện tử: Tri thức Ngữ văn Bài 1',
    description: 'Bộ slide PowerPoint tương tác hỗ trợ dạy học trực tuyến và trực tiếp Tiết 1: Thể loại truyện đồng thoại và nhân vật.',
    type: 'pptx',
    category: 'bai_giang',
    topic: 'Chuyên đề 01: Đọc hiểu',
    order: 6,
    fileUrl: '/hoc_lieu/04_Bai_giang_truc_tuyen.ppsx',
    fileName: '04_Bai_giang_truc_tuyen.ppsx',
    fileSize: '3.8 MB',
    uploadedAt: '2026-10-22',
    author: 'Cô Lâm Oanh',
    isOriginal: true,
    matrixCode: 'BG01',
    statusTag: 'available',
    associatedPeriods: [1],
    contentPreview: `### SLIDE BÀI GIẢNG ĐIỆN TỬ TIẾT 1
**Chủ đề:** Tri thức Ngữ văn - Khám phá truyện đồng thoại
**Số trang:** 24 slide thiết kế chuẩn nhận diện sư phạm.`
  },
  {
    id: 'res-dg01',
    title: 'DG01: Rubric & Bảng kiểm tự đánh giá bài viết và bài nói',
    description: 'Bộ công cụ đánh giá năng lực viết và nói-nghe với tiêu chí rõ ràng, phiếu đánh giá đồng đẳng và tự đánh giá.',
    type: 'pdf',
    category: 'khac',
    topic: 'Chuyên đề 03: Viết',
    order: 7,
    fileUrl: '/hoc_lieu/01_Ke_hoach_bai_day.docx',
    fileName: 'DG01_Rubric_Bang_kiem_danh_gia.pdf',
    fileSize: 'Chuẩn hóa LMS',
    uploadedAt: '2026-10-24',
    author: 'Tổ Ngữ văn K51',
    isOriginal: true,
    matrixCode: 'DG01',
    statusTag: 'available',
    associatedPeriods: [8, 9, 10, 11, 13],
    contentPreview: `### DG01: RUBRIC & BẢNG KIỂM ĐÁNH GIÁ (Gắn với Tiết 8-11, 13)
- Tiêu chí đánh giá bài văn kể lại trải nghiệm: Bố cục 3 phần, ngôi kể thứ nhất, trình tự sự việc, kết hợp miêu tả và cảm xúc.
- Tiêu chí đánh giá bài nói: Tự tin, phát âm rõ ràng, tương tác mắt, nội dung hấp dẫn, lắng nghe và phản hồi lịch sự.`
  },
  {
    id: 'res-bg01-video',
    title: 'BG01: Video bài giảng e-learning 1 (Tri thức Ngữ văn)',
    description: 'Video bài giảng e-learning có cả ghi âm và ghi hình, kiến thức cốt lõi và câu hỏi kiểm tra nhanh theo ma trận.',
    type: 'video',
    category: 'bai_giang',
    topic: 'Chuyên đề 01: Đọc hiểu',
    order: 8,
    fileUrl: '',
    fileName: 'BG01_Tri_thuc_Ngu_van.mp4',
    fileSize: 'Chờ tải lên',
    uploadedAt: '2026-10-24',
    author: 'Tổ Ngữ văn K51',
    isOriginal: false,
    matrixCode: 'BG01',
    statusTag: 'needs_production',
    associatedPeriods: [1],
    contentPreview: `### BG01: BÀI GIẢNG E-LEARNING 1 - TRI THỨC NGỮ VĂN
**Trạng thái ma trận:** Cần sản xuất
**Yêu cầu kỹ thuật:** Có cả ghi âm và ghi hình; nêu rõ mục tiêu, kiến thức cốt lõi về truyện đồng thoại, câu hỏi kiểm tra nhanh đầu vào.
*Giáo viên có thể sử dụng nút "Quản lý học liệu" để tải tệp video MP4 thực tế lên hệ thống Firebase Storage.*`
  },
  {
    id: 'res-bg02-video',
    title: 'BG02: Video bài giảng e-learning 2 (Đọc hiểu Dế Mèn)',
    description: 'Video bài giảng e-learning phân tích chi tiết nhân vật Dế Mèn và Dế Choắt bằng dẫn chứng văn bản.',
    type: 'video',
    category: 'bai_giang',
    topic: 'Chuyên đề 01: Đọc hiểu',
    order: 9,
    fileUrl: '',
    fileName: 'BG02_Doc_hieu_De_Men.mp4',
    fileSize: 'Chờ tải lên',
    uploadedAt: '2026-10-24',
    author: 'Cô Thu Hiếu',
    isOriginal: false,
    matrixCode: 'BG02',
    statusTag: 'needs_production',
    associatedPeriods: [2, 3, 4],
    contentPreview: `### BG02: BÀI GIẢNG E-LEARNING 2 - ĐỌC HIỂU BÀI HỌC ĐƯỜNG ĐỜI ĐẦU TIÊN
**Trạng thái ma trận:** Cần sản xuất
**Yêu cầu kỹ thuật:** Có cả ghi âm và ghi hình; phân tích nhân vật bằng dẫn chứng văn bản, liên hệ bài học đường đời đầu tiên.
*Giáo viên có thể sử dụng nút "Quản lý học liệu" để tải tệp video MP4 thực tế lên hệ thống Firebase Storage.*`
  },
  {
    id: 'res-bg03-video',
    title: 'BG03: Video bài giảng e-learning 3 (Thực hành tiếng Việt)',
    description: 'Video bài giảng e-learning hướng dẫn nhận diện từ đơn/từ phức, từ ghép/từ láy và phân tích tác dụng của từ láy.',
    type: 'video',
    category: 'bai_giang',
    topic: 'Chuyên đề 02: Tiếng Việt',
    order: 10,
    fileUrl: '',
    fileName: 'BG03_Thuc_hanh_tieng_Viet.mp4',
    fileSize: 'Chờ tải lên',
    uploadedAt: '2026-10-24',
    author: 'Cô Kim Xuyến',
    isOriginal: false,
    matrixCode: 'BG03',
    statusTag: 'needs_production',
    associatedPeriods: [5, 6],
    contentPreview: `### BG03: BÀI GIẢNG E-LEARNING 3 - THỰC HÀNH TIẾNG VIỆT
**Trạng thái ma trận:** Cần sản xuất
**Yêu cầu kỹ thuật:** Có cả ghi âm và ghi hình; từ đơn/từ phức, từ ghép/từ láy, nghĩa của từ ngữ, tác dụng từ láy.
*Giáo viên có thể sử dụng nút "Quản lý học liệu" để tải tệp video MP4 thực tế lên hệ thống Firebase Storage.*`
  },
  {
    id: 'res-vd01',
    title: 'VD01: Video hỗ trợ học tập & Tình huống ứng xử',
    description: 'Video tình huống giáo dục về tình bạn và kỹ năng ứng xử, kèm câu hỏi định hướng trước và sau khi xem.',
    type: 'video',
    category: 'da_phuong_tien',
    topic: 'Chuyên đề 01: Đọc hiểu',
    order: 11,
    fileUrl: '',
    fileName: 'VD01_Tinh_huong_ung_xu.mp4',
    fileSize: 'Chờ tải lên',
    uploadedAt: '2026-10-24',
    author: 'Tổ Kỹ thuật LMS',
    isOriginal: false,
    matrixCode: 'VD01',
    statusTag: 'needs_supplement',
    associatedPeriods: [1, 4, 7],
    contentPreview: `### VD01: VIDEO HỖ TRỢ HỌC TẬP & TÌNH HUỐNG ỨNG XỬ
**Trạng thái ma trận:** Cần bổ sung
**Yêu cầu kỹ thuật:** Có câu hỏi trước/sau khi xem; ghi rõ nguồn hoặc sử dụng video tự tạo. Gắn với Tiết 1, Tiết 4 và Tiết 7.
*Giáo viên có thể bổ sung tệp MP4 hoặc liên kết video qua trang Quản lý học liệu.*`
  }
];

export const INITIAL_LESSONS: LessonData[] = [
  {
    id: 'module-1',
    key: 'reading',
    tag: 'CHUYÊN ĐỀ 01',
    category: 'ĐỌC HIỂU',
    title: 'Tri thức Ngữ văn & Đọc hiểu văn bản',
    description: 'Gồm 4 tiết học (Tiết 1 – 4): Tiếp cận thể loại truyện đồng thoại và khám phá sâu sắc văn bản "Bài học đường đời đầu tiên" (Tô Hoài).',
    coverGradient: 'from-sky-100 to-sky-300',
    icon: '📚',
    status: 'Tiết 1 – 4 (4 tiết)',
    periodRange: 'Tiết 1 – 4 (4 tiết)',
    totalOnlineMinutes: 77.12, // 4 x 19.28
    totalDirectMinutes: 180, // 4 x 45
    objectives: [
      'Nêu được chủ đề bài học; nhận biết khái niệm và các yếu tố truyện đồng thoại (cốt truyện, nhân vật, ngôi kể, lời kể).',
      'Đọc diễn cảm; nhận biết người kể chuyện ngôi thứ nhất, trình tự sự việc trong văn bản.',
      'Phân tích được đặc điểm nhân vật Dế Mèn và Dế Choắt bằng các chi tiết tiêu biểu về ngoại hình, cử chỉ, hành động, lời nói.',
      'Lí giải được hậu quả hành động trêu chị Cốc và rút ra bài học đường đời đầu tiên về lòng khiêm tốn, trách nhiệm.'
    ],
    tasks: [
      'Tiết 1: Đọc trước phần Tri thức Ngữ văn, xem bài giảng định hướng và trả lời câu hỏi khởi động.',
      'Tiết 2: Đọc văn bản trong SGK, ghi chú từ khó và hoàn thành phiếu nhận biết ngôi kể.',
      'Tiết 3: Xem đoạn bài giảng phân tích nhân vật, điền bảng dẫn chứng ngoại hình và hành động.',
      'Tiết 4: Trả lời câu hỏi tình huống trên LMS và viết phản hồi ngắn 5–7 câu kết nối đọc.'
    ],
    product: 'Phiếu đọc hiểu BT01, bảng phân tích nhân vật và đoạn văn ngắn suy ngẫm.',
    contentBody: `### CHUYÊN ĐỀ 01: TRI THỨC NGỮ VĂN & BÀI HỌC ĐƯỜNG ĐỜI ĐẦU TIÊN (TIẾT 1 – 4)
Khám phá trọn vẹn văn bản nền tảng của Bài 1: Tôi và các bạn, kết hợp hài hòa 30% thời lượng tự học trực tuyến trên LMS và 70% thời lượng tương tác trực tiếp trên lớp.`,
    periods: [
      {
        periodNumber: 1,
        title: 'Tiết 1: Tri thức Ngữ văn & Định hướng bài học',
        strand: 'Tri thức Ngữ văn',
        contentActivity: 'Khởi động; giới thiệu chủ đề "Tôi và các bạn"; tìm hiểu khái niệm truyện đồng thoại, cốt truyện, nhân vật, người kể chuyện, lời kể và lời nhân vật.',
        objectives: 'Nêu được chủ đề; nhận biết khái niệm và một số yếu tố cốt lõi của truyện đồng thoại.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Xem bài giảng mở đầu/video tóm tắt tri thức; trả lời câu hỏi khởi động; đọc trước phần Tri thức Ngữ văn trong SGK.',
        directActivity: 'Hoạt động "Tình bạn là..."; giải mật thư tìm từ khóa; hệ thống hóa khái niệm bằng sơ đồ tương tác trên lớp.',
        learningResourceCodes: ['BG01', 'VD01', 'KHBD'],
        learningResourceDesc: 'Bài giảng e-learning 1 (BG01 - slide/MP4); Video tình huống ứng xử (VD01); Kế hoạch bài dạy (KHBD).',
        evidenceAssessment: 'Câu hỏi khởi động; câu hỏi kiểm tra nhanh trên LMS; sản phẩm sơ đồ tư duy khái niệm.'
      },
      {
        periodNumber: 2,
        title: 'Tiết 2: Đọc văn bản "Bài học đường đời đầu tiên" (Phần 1)',
        strand: 'Đọc hiểu văn bản',
        contentActivity: 'Đọc văn bản; tìm hiểu tác giả Tô Hoài, tác phẩm "Dế Mèn phiêu lưu ký", chú thích từ khó; xác định ngôi kể và chuỗi sự việc chính.',
        objectives: 'Đọc đúng, diễn cảm; nhận biết người kể chuyện ngôi thứ nhất ("tôi" - Dế Mèn), nhân vật và trình tự sự việc.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Đọc trước văn bản trong SGK; xem hướng dẫn đọc; ghi chú từ khó và đặt ít nhất 1 câu hỏi thắc mắc.',
        directActivity: 'Luyện đọc diễn cảm phân vai; xác định ngôi kể, nhân vật, tình huống truyện và tóm tắt chuỗi sự việc chính.',
        learningResourceCodes: ['BG02', 'BT01'],
        learningResourceDesc: 'Bài giảng e-learning 2 (BG02); Văn bản SGK; Phiếu bài tập đọc hiểu PISA (BT01); Bảng kiểm đọc diễn cảm.',
        evidenceAssessment: 'Phiếu đọc hiểu BT01 (phần thu nhận thông tin); quan sát đọc diễn cảm; câu hỏi nhận biết.'
      },
      {
        periodNumber: 3,
        title: 'Tiết 3: Đọc văn bản "Bài học đường đời đầu tiên" (Phần 2)',
        strand: 'Đọc hiểu văn bản',
        contentActivity: 'Phân tích ngoại hình, cử chỉ, hành động, ngôn ngữ và suy nghĩ của hai nhân vật Dế Mèn và Dế Choắt.',
        objectives: 'Phân tích được đặc điểm nhân vật bằng các chi tiết, dẫn chứng tiêu biểu trong văn bản.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Xem đoạn bài giảng phân tích nhân vật; hoàn thành bảng dẫn chứng sơ bộ về ngoại hình và hành động của Dế Mèn.',
        directActivity: 'Thảo luận nhóm 4 học sinh; đối chiếu dẫn chứng; thuyết trình so sánh sự đối lập giữa Dế Mèn và Dế Choắt.',
        learningResourceCodes: ['BG02', 'BT01'],
        learningResourceDesc: 'Bảng nhân vật; Phiếu học tập BT01; Bài giảng ghi hình BG02; Trích đoạn minh họa văn bản.',
        evidenceAssessment: 'Bảng phân tích nhân vật có dẫn chứng; phiếu đánh giá đồng đẳng giữa các nhóm.'
      },
      {
        periodNumber: 4,
        title: 'Tiết 4: Đọc văn bản "Bài học đường đời đầu tiên" (Phần 3)',
        strand: 'Đọc hiểu văn bản',
        contentActivity: 'Sự việc Dế Mèn trêu chị Cốc; hậu quả cái chết của Dế Choắt và bài học đường đời đầu tiên về cách ứng xử.',
        objectives: 'Lí giải được hậu quả của hành động trêu chị Cốc; nêu bài học về trách nhiệm và cách ứng xử trong cuộc sống.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Trả lời câu hỏi tình huống trên LMS; viết phản hồi ngắn có dẫn chứng văn bản.',
        directActivity: 'Phân tích nguyên nhân – hậu quả cái chết của Dế Choắt; thảo luận cách đối diện lỗi lầm; viết kết nối với đọc (5–7 câu).',
        learningResourceCodes: ['VD01', 'BT01'],
        learningResourceDesc: 'Video/tình huống ứng xử (VD01); Phiếu nguyên nhân – hậu quả (BT01); Hướng dẫn viết đoạn văn kết nối đọc.',
        evidenceAssessment: 'Đoạn văn ngắn 5–7 câu; phiếu phản hồi theo tiêu chí; câu trả lời tình huống.'
      }
    ]
  },
  {
    id: 'module-2',
    key: 'vietnamese',
    tag: 'CHUYÊN ĐỀ 02',
    category: 'THỰC HÀNH TIẾNG VIỆT',
    title: 'Thực hành tiếng Việt',
    description: 'Gồm 2 tiết học (Tiết 5 – 6): Phân biệt từ đơn, từ phức (từ ghép và từ láy); giải nghĩa từ ngữ và phân tích tác dụng gợi cảm của từ láy trong ngữ cảnh.',
    coverGradient: 'from-amber-100 to-amber-300',
    icon: '✍️',
    status: 'Tiết 5 – 6 (2 tiết)',
    periodRange: 'Tiết 5 – 6 (2 tiết)',
    totalOnlineMinutes: 38.56, // 2 x 19.28
    totalDirectMinutes: 90, // 2 x 45
    objectives: [
      'Nhận biết, phân loại được từ đơn và từ phức; bước đầu phân biệt được từ ghép và từ láy.',
      'Giải thích được nghĩa của từ ngữ trong ngữ cảnh văn bản.',
      'Phân tích được giá trị biểu đạt, gợi hình, gợi cảm của hệ thống từ láy trong văn miêu tả.'
    ],
    tasks: [
      'Tiết 5: Xem bài giảng e-learning 3, làm bài tập phân loại từ tương tác trên LMS.',
      'Tiết 6: Làm bài tập nhận diện từ láy, phân tích tác dụng và thực hiện bài kiểm tra 15 phút KT01.'
    ],
    product: 'Phiếu bài tập BT02, bài trắc nghiệm tương tác và bài kiểm tra KT01.',
    contentBody: `### CHUYÊN ĐỀ 02: THỰC HÀNH TIẾNG VIỆT (TIẾT 5 – 6)
Rèn luyện năng lực ngôn ngữ tiếng Việt qua việc nhận diện cấu tạo từ, hiểu nghĩa từ trong ngữ cảnh và khám phá nghệ thuật sử dụng từ láy điêu luyện của Tô Hoài.`,
    periods: [
      {
        periodNumber: 5,
        title: 'Tiết 5: Từ đơn, từ phức; Nhận biết từ ghép và từ láy',
        strand: 'Thực hành tiếng Việt',
        contentActivity: 'Tìm hiểu từ đơn, từ phức; nhận biết và bước đầu phân loại từ ghép và từ láy trong ngữ cảnh cụ thể.',
        objectives: 'Nhận biết, phân loại được từ đơn và từ phức; bước đầu phân biệt từ ghép, từ láy.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Xem bài giảng e-learning 3 (BG03); làm bài tập phân loại 10 từ trên LMS và xem phản hồi chấm điểm tự động.',
        directActivity: 'Luyện tập phân tích từ ngữ trong ngữ cảnh văn bản; giải thích căn cứ phân loại từ ghép/từ láy; chữa lỗi dùng từ.',
        learningResourceCodes: ['BG03', 'BT02'],
        learningResourceDesc: 'Bài giảng e-learning 3 (BG03); Phiếu bài tập tiếng Việt (BT02); Quiz phân loại tương tác.',
        evidenceAssessment: 'Kết quả bài tập quiz trên LMS; bài tập phân loại có phản hồi hướng dẫn giải.'
      },
      {
        periodNumber: 6,
        title: 'Tiết 6: Nghĩa của từ ngữ và tác dụng của từ láy trong văn bản',
        strand: 'Thực hành tiếng Việt',
        contentActivity: 'Giải nghĩa từ ngữ trong ngữ cảnh; phân tích tác dụng của từ láy trong đoạn văn miêu tả Dế Mèn; kiểm tra thường xuyên.',
        objectives: 'Giải thích được nghĩa của từ ngữ trong ngữ cảnh; phân tích tác dụng gợi hình, gợi cảm của từ láy.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Làm bài tập nhận diện từ láy và giải thích nghĩa từ trong đoạn trích; nộp câu trả lời trên LMS.',
        directActivity: 'Phân tích ví dụ từ văn bản Dế Mèn; vận dụng từ láy vào viết câu/đoạn văn miêu tả; làm bài kiểm tra KT01.',
        learningResourceCodes: ['BT02', 'KT01'],
        learningResourceDesc: 'Phiếu bài tập BT02; Đề kiểm tra thường xuyên tiếng Việt KT01; Bảng gợi ý phân tích tác dụng từ láy.',
        evidenceAssessment: 'Bài kiểm tra 15 phút KT01; bài tập vận dụng viết câu có sử dụng từ láy; nhận xét và chữa lỗi.'
      }
    ]
  },
  {
    id: 'module-3',
    key: 'writing',
    tag: 'CHUYÊN ĐỀ 03',
    category: 'VIẾT',
    title: 'Viết: Kể lại một trải nghiệm của bản thân',
    description: 'Gồm 3 tiết học (Tiết 8 – 10): Tiến trình viết bài văn tự sự kể lại trải nghiệm theo 4 bước (Chuẩn bị -> Tìm ý & Lập dàn ý -> Viết bản nháp -> Chỉnh sửa theo rubric).',
    coverGradient: 'from-emerald-100 to-emerald-300',
    icon: '🧭',
    status: 'Tiết 8 – 10 (3 tiết)',
    periodRange: 'Tiết 8 – 10 (3 tiết)',
    totalOnlineMinutes: 57.84, // 3 x 19.28
    totalDirectMinutes: 135, // 3 x 45
    objectives: [
      'Xác định được trải nghiệm thực tế phù hợp để kể; chọn lọc sự việc và chi tiết tiêu biểu.',
      'Lập được dàn ý 3 phần (Mở bài, Thân bài, Kết bài); viết bản nháp theo trình tự hợp lý, có yếu tố miêu tả và cảm xúc.',
      'Biết tự rà soát, chỉnh sửa bài viết của mình và góp ý cho bạn học dựa trên bảng kiểm (Checklist) và rubric đánh giá.'
    ],
    tasks: [
      'Tiết 8: Xem hướng dẫn tìm ý, điền phiếu chọn trải nghiệm và xác định sự việc chính.',
      'Tiết 9: Xem video hướng dẫn lập dàn ý, nộp dàn ý chi tiết và viết phần Mở bài/Thân bài.',
      'Tiết 10: Rà soát bài viết theo bảng kiểm DG01, tự chỉnh sửa lỗi diễn đạt và hoàn thiện bài văn.'
    ],
    product: 'Phiếu tìm ý, dàn ý chi tiết, bản nháp và bài văn hoàn chỉnh kể lại trải nghiệm.',
    contentBody: `### CHUYÊN ĐỀ 03: VIẾT BÀI VĂN KỂ LẠI MỘT TRẢI NGHIỆM (TIẾT 8 – 10)
Thực hành quy trình viết sáng tạo: từ việc lựa chọn trải nghiệm có ý nghĩa về tình bạn đến việc cấu trúc bài viết, sử dụng ngôi kể thứ nhất và lồng ghép cảm xúc chân thật.`,
    periods: [
      {
        periodNumber: 8,
        title: 'Tiết 8: Tìm ý, xác định trải nghiệm, người kể và trình tự sự việc',
        strand: 'Viết',
        contentActivity: 'Tìm ý; xác định đề tài trải nghiệm bản thân, ngôi kể thứ nhất, các nhân vật liên quan và trình tự diễn biến sự việc.',
        objectives: 'Xác định được trải nghiệm phù hợp; chọn lọc sự việc và chi tiết tiêu biểu, có ý nghĩa.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Xem bài giảng hướng dẫn tìm ý; tải và điền phiếu chọn trải nghiệm, xác định các sự việc chính của câu chuyện.',
        directActivity: 'Chia sẻ đề tài trong nhóm đôi; hoàn thiện phiếu tìm ý; nhận góp ý của bạn học và giáo viên.',
        learningResourceCodes: ['KHBD', 'DG01'],
        learningResourceDesc: 'Bài giảng hướng dẫn viết; Phiếu tìm ý; Mẫu gợi ý trải nghiệm; Bảng kiểm chuẩn bị bài viết (DG01).',
        evidenceAssessment: 'Phiếu tìm ý hoàn chỉnh; bảng kiểm tự rà soát đề tài trải nghiệm.'
      },
      {
        periodNumber: 9,
        title: 'Tiết 9: Lập dàn ý và viết bản nháp bài văn kể lại một trải nghiệm',
        strand: 'Viết',
        contentActivity: 'Lập dàn ý chi tiết 3 phần (Mở bài - Thân bài - Kết bài); thực hành viết bản nháp bài văn.',
        objectives: 'Lập được dàn ý rõ ràng; viết được bản nháp theo trình tự thời gian/tâm lý, có chi tiết miêu tả và cảm xúc.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Xem video hướng dẫn lập dàn ý; hoàn thành dàn ý chi tiết và nộp phần Mở bài hoặc đoạn cao trào trên LMS.',
        directActivity: 'Hoàn thiện dàn ý trên lớp; viết bài có hướng dẫn của giáo viên; trao đổi theo cặp về cách mở bài và kết bài.',
        learningResourceCodes: ['DG01'],
        learningResourceDesc: 'Video hướng dẫn viết; Phiếu lập dàn ý; Rubric đánh giá bài viết kể lại trải nghiệm (DG01).',
        evidenceAssessment: 'Dàn ý chi tiết 3 phần; bản nháp bài văn; phản hồi theo tiêu chí rubric.'
      },
      {
        periodNumber: 10,
        title: 'Tiết 10: Chỉnh sửa và hoàn thiện bài văn kể lại một trải nghiệm',
        strand: 'Viết',
        contentActivity: 'Rà soát bài viết theo phiếu chỉnh sửa; tự sửa lỗi dùng từ, câu, liên kết đoạn; chia sẻ bài viết hay.',
        objectives: 'Biết tự kiểm tra, chỉnh sửa bài viết của mình và góp ý cho bạn dựa trên tiêu chí rubric rõ ràng.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Đọc lại bản nháp, đối chiếu với DG01 (Bảng kiểm chỉnh sửa bài viết); nộp bản chỉnh sửa sơ bộ.',
        directActivity: 'Chỉnh sửa chéo theo cặp; sửa lỗi dùng từ và câu biểu cảm; nghe giáo viên phân tích bài viết mẫu.',
        learningResourceCodes: ['DG01'],
        learningResourceDesc: 'DG01 (Bảng kiểm và phiếu tự đánh giá bài viết); Phiếu góp ý đồng đẳng.',
        evidenceAssessment: 'Bài viết hoàn chỉnh (400 - 600 chữ); phiếu tự đánh giá và đánh giá chéo của bạn học.'
      }
    ]
  },
  {
    id: 'module-4',
    key: 'speaking',
    tag: 'CHUYÊN ĐỀ 04',
    category: 'NÓI VÀ NGHE',
    title: 'Nói và nghe: Kể lại một trải nghiệm đáng nhớ',
    description: 'Gồm 1 tiết học (Tiết 11): Rèn luyện kỹ năng nói tự tin, kể lại trải nghiệm mạch lạc trước đám đông và rèn luyện kỹ năng lắng nghe tích cực, phản hồi văn minh.',
    coverGradient: 'from-purple-100 to-purple-300',
    icon: '🎙️',
    status: 'Tiết 11 (1 tiết)',
    periodRange: 'Tiết 11 (1 tiết)',
    totalOnlineMinutes: 19.28,
    totalDirectMinutes: 45,
    objectives: [
      'Biết cách trình bày bài nói kể lại trải nghiệm rõ ràng, mạch lạc trong 2-3 phút.',
      'Sử dụng giọng điệu, cử chỉ, ánh mắt phù hợp với nội dung câu chuyện.',
      'Thực hành lắng nghe tích cực, ghi chép câu hỏi và phản hồi tôn trọng người nói theo rubric.'
    ],
    tasks: [
      'Chuẩn bị đề cương bài nói, ghi âm thử 1–2 phút trên điện thoại/LMS.',
      'Trình bày bài nói trước nhóm học tập trên lớp.',
      'Đánh giá bài nói của bạn dựa trên phiếu tiêu chí Rubric DG01.'
    ],
    product: 'Bản ghi âm/video bài nói, phiếu phản hồi người nghe và bảng đánh giá rubric.',
    contentBody: `### CHUYÊN ĐỀ 04: NÓI VÀ NGHE (TIẾT 11)
Chuyển hóa văn bản viết thành bài nói sinh động. Học sinh làm chủ kỹ năng biểu đạt ngôn ngữ cơ thể, tương tác với người nghe và xây dựng văn hóa giao tiếp tôn trọng, thấu cảm.`,
    periods: [
      {
        periodNumber: 11,
        title: 'Tiết 11: Kể lại một trải nghiệm đáng nhớ & Lắng nghe tích cực',
        strand: 'Nói và nghe',
        contentActivity: 'Kể lại một trải nghiệm đáng nhớ; thực hành đóng vai người nói và người nghe tích cực.',
        objectives: 'Trình bày bài nói tự tin trong 2-3 phút, phát âm rõ ràng, có cảm xúc; biết lắng nghe, ghi chép và phản hồi lịch sự.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Chuẩn bị dàn ý tóm tắt bài nói; tự luyện nói trước gương hoặc ghi âm thử 1–2 phút trên LMS; đọc kỹ tiêu chí đánh giá DG01.',
        directActivity: 'Trình bày bài nói trước nhóm học tập; người nghe ghi chép và đặt câu hỏi phản hồi; bầu chọn bài nói truyền cảm hứng.',
        learningResourceCodes: ['DG01'],
        learningResourceDesc: 'DG01 (Rubric đánh giá bài nói và kỹ năng người nghe); Phiếu ghi chép phản hồi.',
        evidenceAssessment: 'Video/Audio bài nói hoặc bản ghi phản hồi bạn học; bảng đánh giá theo tiêu chí DG01.'
      }
    ]
  },
  {
    id: 'module-5',
    key: 'friends',
    tag: 'CHUYÊN ĐỀ 05',
    category: 'ĐỌC MỞ RỘNG',
    title: 'Đọc mở rộng trong chủ đề "Tôi và các bạn"',
    description: 'Gồm 1 tiết học (Tiết 7): Đọc văn bản ngoài SGK cùng chủ đề, liên hệ bài học về tình bạn, sự thấu hiểu và tôn trọng sự khác biệt giữa các cá nhân.',
    coverGradient: 'from-rose-100 to-rose-300',
    icon: '💬',
    status: 'Tiết 7 (1 tiết)',
    periodRange: 'Tiết 7 (1 tiết)',
    totalOnlineMinutes: 19.28,
    totalDirectMinutes: 45,
    objectives: [
      'Tìm đọc và phân tích văn bản cùng chủ đề tình bạn, truyện đồng thoại hoặc truyện thiếu nhi.',
      'Vận dụng kiến thức đọc hiểu để nhận xét nhân vật, thông điệp và liên hệ trải nghiệm ứng xử của bản thân.',
      'Hình thành ý thức tôn trọng sự khác biệt và biết chia sẻ, hỗ trợ bạn bè.'
    ],
    tasks: [
      'Đọc trước ngữ liệu đọc mở rộng được giao ("Nếu cậu muốn có một người bạn...").',
      'Điền phiếu đọc mở rộng BT01 (ghi lại chi tiết ấn tượng và câu hỏi liên hệ).',
      'Tạo một Thẻ thông điệp tình bạn gửi tặng một người bạn trong lớp.'
    ],
    product: 'Phiếu đọc mở rộng BT01, Thẻ thông điệp tình bạn và bản thu hoạch nhóm.',
    contentBody: `### CHUYÊN ĐỀ 05: ĐỌC MỞ RỘNG TRONG CHỦ ĐỀ (TIẾT 7)
Mở rộng tầm mắt ra ngoài trang sách giáo khoa: tiếp cận những câu chuyện cảm động về tình bạn, học cách trân trọng sự độc đáo của mỗi người bạn quanh mình.`,
    periods: [
      {
        periodNumber: 7,
        title: 'Tiết 7: Đọc mở rộng về tình bạn và ứng xử tôn trọng khác biệt',
        strand: 'Đọc mở rộng trong chủ đề',
        contentActivity: 'Đọc văn bản trong phạm vi kế hoạch dạy học; so sánh đặc điểm nhân vật, thông điệp về tình bạn và cách ứng xử văn minh.',
        objectives: 'Vận dụng kiến thức đọc hiểu để nhận xét nhân vật, thông điệp và liên hệ trải nghiệm ứng xử của bản thân.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Đọc trước ngữ liệu được giao; ghi lại chi tiết ấn tượng và câu hỏi suy ngẫm vào phiếu đọc mở rộng.',
        directActivity: 'Trao đổi nhóm; so sánh chi tiết/nhân vật với Dế Mèn và Dế Choắt; trình bày bài học ứng xử trong tình bạn.',
        learningResourceCodes: ['BT01', 'VD01'],
        learningResourceDesc: 'Phiếu đọc mở rộng (BT01); Câu hỏi định hướng; Video tình huống phù hợp lứa tuổi (VD01).',
        evidenceAssessment: 'Phiếu đọc mở rộng BT01; câu trả lời có dẫn chứng; Thẻ thông điệp tình bạn gửi bạn học.'
      }
    ]
  },
  {
    id: 'module-6',
    key: 'assessment',
    tag: 'CHUYÊN ĐỀ 06',
    category: 'ÔN TẬP & ĐÁNH GIÁ',
    title: 'Củng cố, mở rộng & Đánh giá tổng kết',
    description: 'Gồm 2 tiết học (Tiết 12 – 13): Hệ thống hóa toàn diện kiến thức đọc hiểu, tiếng Việt, viết, nói & nghe và làm bài kiểm tra tổng kết KT02.',
    coverGradient: 'from-amber-200 to-yellow-300',
    icon: '🏆',
    status: 'Tiết 12 – 13 (2 tiết)',
    periodRange: 'Tiết 12 – 13 (2 tiết)',
    totalOnlineMinutes: 38.63, // 19.28 + 19.35 = 38.63
    totalDirectMinutes: 90, // 2 x 45
    objectives: [
      'Hệ thống hóa toàn bộ kiến thức tri thức Ngữ văn, tiếng Việt, kỹ năng viết và nói - nghe của Bài 1 bằng sơ đồ tư duy.',
      'Tự đánh giá mức độ đạt chuẩn năng lực đầu ra qua bài kiểm tra trắc nghiệm và tự luận tổng kết KT02.',
      'Nhận phản hồi cá nhân hóa từ giáo viên để khắc phục hạn chế và chuẩn bị cho Bài 2.'
    ],
    tasks: [
      'Tiết 12: Hoàn thành sơ đồ tư duy tổng kết Bài 1 và bảng tự đánh giá sự tiến bộ.',
      'Tiết 13: Đọc kỹ hướng dẫn và thực hiện bài kiểm tra tổng kết đọc hiểu & viết KT02.'
    ],
    product: 'Sơ đồ tư duy tổng kết Bài 1 và bài kiểm tra tổng kết hoàn chỉnh KT02.',
    contentBody: `### CHUYÊN ĐỀ 06: CỦNG CỐ, MỞ RỘNG & ĐÁNH GIÁ TỔNG KẾT (TIẾT 12 – 13)
Khép lại Bài 1 bằng việc hệ thống hóa toàn diện các năng lực đặc thù và phẩm chất đã đạt được, thông qua sản phẩm sơ đồ tư duy sáng tạo và bài kiểm tra đánh giá khách quan KT02.`,
    periods: [
      {
        periodNumber: 12,
        title: 'Tiết 12: Củng cố, mở rộng chủ đề "Tôi và các bạn"',
        strand: 'Củng cố, mở rộng',
        contentActivity: 'Hệ thống hóa kiến thức toàn bài về đọc hiểu, tiếng Việt, viết, nói và nghe bằng sơ đồ tư duy tổng hợp.',
        objectives: 'Tổng hợp, hệ thống hóa được các nội dung trọng tâm của Bài 1; tự đánh giá sự tiến bộ của bản thân.',
        durationOnline: 19.28,
        durationDirect: 45,
        onlineActivity: 'Hoàn thành sơ đồ tư duy tổng kết Bài 1 trên LMS; tự rà soát danh sách yêu cầu cần đạt.',
        directActivity: 'Thuyết minh sơ đồ tư duy theo nhóm; thảo luận và giải đáp thắc mắc toàn bài cùng giáo viên.',
        learningResourceCodes: ['KHBD'],
        learningResourceDesc: 'Sơ đồ tư duy mẫu; Bảng tổng hợp yêu cầu cần đạt Bài 1; Kế hoạch bài dạy (KHBD).',
        evidenceAssessment: 'Sản phẩm sơ đồ tư duy của học sinh; bảng tự kiểm tra kiến thức của cá nhân.'
      },
      {
        periodNumber: 13,
        title: 'Tiết 13: Đánh giá và phản hồi kết quả học tập Bài 1',
        strand: 'Đánh giá và phản hồi',
        contentActivity: 'Thực hiện bài kiểm tra tổng kết đọc hiểu và viết KT02; giáo viên nhận xét, sửa bài và phản hồi kết quả.',
        objectives: 'Đánh giá mức độ đạt chuẩn năng lực đọc hiểu và viết của học sinh sau Bài 1 theo ma trận đề chuẩn.',
        durationOnline: 19.35,
        durationDirect: 45,
        onlineActivity: 'Đọc hướng dẫn làm bài và tiêu chí chấm điểm; xem lại bài làm và phản hồi chi tiết của giáo viên trên LMS.',
        directActivity: 'Làm bài kiểm tra tổng kết KT02 (hoặc sửa bài, nhận xét trực tiếp trên lớp); giải thích đáp án và rút kinh nghiệm.',
        learningResourceCodes: ['KT02', 'DG01'],
        learningResourceDesc: 'KT02 (Đề kiểm tra đọc hiểu và viết có ma trận, đặc tả, đề bài, đáp án và hướng dẫn chấm); DG01 (Rubric chấm điểm).',
        evidenceAssessment: 'Bài kiểm tra hoàn chỉnh KT02; điểm số và nhận xét định lượng/định tính của giáo viên.'
      }
    ]
  }
];

export const INITIAL_FRIENDSHIP_MESSAGES: FriendshipMessage[] = [
  {
    id: 'msg-1',
    author: 'Minh Khang (Lớp 6A)',
    content: 'Tình bạn giống như một cuốn sách hay, càng đọc càng thấy nhiều điều kỳ diệu và ấm áp!',
    tag: 'Tri kỷ',
    createdAt: '2026-10-23',
    likes: 12
  },
  {
    id: 'msg-2',
    author: 'Ngọc Hân (Lớp 6B)',
    content: 'Cảm ơn bạn Lan đã luôn kiên nhẫn giảng lại bài toán khó cho mình. Chúng mình hãy luôn cùng nhau cố gắng nhé!',
    tag: 'Biết ơn',
    createdAt: '2026-10-24',
    likes: 9
  },
  {
    id: 'msg-3',
    author: 'Hoàng Nam (Lớp 6A)',
    content: 'Sau khi học bài Dế Mèn, mình hiểu rằng trêu chọc người khác không phải là dũng cảm, mà tôn trọng sự khác biệt mới là bản lĩnh.',
    tag: 'Bài học',
    createdAt: '2026-10-24',
    likes: 15
  }
];

export const TEAM_MEMBERS = [
  {
    id: 'member-1',
    name: 'Tú Lành',
    role: 'Thiết kế kỹ thuật · LMS',
    label: 'THÀNH VIÊN 01',
    subject: 'Môn học: Ngữ văn',
    academic: 'Học viên Cao học – K51',
    university: 'Trường Đại học Sư phạm – Đại học Đà Nẵng',
    colorBg: '#d9efff',
    avatarAccent: '#248de0'
  },
  {
    id: 'member-2',
    name: 'Thu Hiếu',
    role: 'Nội dung bài giảng 1',
    label: 'THÀNH VIÊN 02',
    subject: 'Môn học: Ngữ văn',
    academic: 'Học viên Cao học – K51',
    university: 'Trường Đại học Sư phạm – Đại học Đà Nẵng',
    colorBg: '#dff8f0',
    avatarAccent: '#39c5a4'
  },
  {
    id: 'member-3',
    name: 'Lâm Oanh',
    role: 'Nội dung bài giảng 2',
    label: 'THÀNH VIÊN 03',
    subject: 'Môn học: Ngữ văn',
    academic: 'Học viên Cao học – K51',
    university: 'Trường Đại học Sư phạm – Đại học Đà Nẵng',
    colorBg: '#fef1df',
    avatarAccent: '#f59e0b'
  },
  {
    id: 'member-4',
    name: 'Kim Xuyến',
    role: 'Nội dung bài giảng 3',
    label: 'THÀNH VIÊN 04',
    subject: 'Môn học: Ngữ văn',
    academic: 'Học viên Cao học – K51',
    university: 'Trường Đại học Sư phạm – Đại học Đà Nẵng',
    colorBg: '#fce8f0',
    avatarAccent: '#ec4899'
  }
];
