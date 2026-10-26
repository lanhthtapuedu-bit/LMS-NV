import os
import zipfile

def create_docx(filename, title, subtitle, content_paragraphs):
    # Minimal valid docx structure
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    p_xml = f"""<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="163D85"/></w:rPr><w:t>{title}</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="24"/><w:color w:val="FF6B24"/></w:rPr><w:t>{subtitle}</w:t></w:r></w:p>
<w:p/>"""

    for p in content_paragraphs:
        if p.startswith("## "):
            p_xml += f"""<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="20334E"/></w:rPr><w:t>{p[3:]}</w:t></w:r></w:p>"""
        elif p.startswith("### "):
            p_xml += f"""<w:p><w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="1686D9"/></w:rPr><w:t>{p[4:]}</w:t></w:r></w:p>"""
        elif p.startswith("- "):
            p_xml += f"""<w:p><w:pPr><w:ind w:left="400"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>• {p[2:]}</w:t></w:r></w:p>"""
        elif p.strip():
            p_xml += f"""<w:p><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>{p}</w:t></w:r></w:p>"""
        else:
            p_xml += "<w:p/>"

    doc_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {p_xml}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>"""

    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('word/document.xml', doc_xml)

def create_ppsx(filename, title, subtitle):
    # Minimal valid presentation
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>"""

    pres_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst><p:sldId id="256" r:id="rId1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/></p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
</p:presentation>"""

    pres_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
</Relationships>"""

    slide_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="762000" y="1524000"/><a:ext cx="7620000" cy="1371600"/></a:xfrm></p:spPr>
        <p:txBody>
          <a:bodyPr/><a:lstStyle/>
          <a:p><a:r><a:rPr lang="vi-VN" sz="4000"><a:solidFill><a:srgbClr val="163D85"/></a:solidFill></a:rPr><a:t>{title}</a:t></a:r></a:p>
          <a:p><a:r><a:rPr lang="vi-VN" sz="2400"><a:solidFill><a:srgbClr val="FF6B24"/></a:solidFill></a:rPr><a:t>{subtitle}</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>"""

    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('ppt/presentation.xml', pres_xml)
        z.writestr('ppt/_rels/presentation.xml.rels', pres_rels)
        z.writestr('ppt/slides/slide1.xml', slide_xml)

out_dir = "public/hoc_lieu"
os.makedirs(out_dir, exist_ok=True)

# 01_Ke_hoach_bai_day.docx
create_docx(
    os.path.join(out_dir, "01_Ke_hoach_bai_day.docx"),
    "KẾ HOẠCH BÀI DẠY (GIÁO ÁN)",
    "BÀI 1: TÔI VÀ CÁC BẠN (SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - NGỮ VĂN 6)",
    [
        "## I. MỤC TIÊU BÀI HỌC",
        "### 1. Năng lực đặc thù",
        "- Nhận biết được một số yếu tố của truyện đồng thoại (cốt truyện, nhân vật, lời người kể chuyện, lời nhân vật).",
        "- Nhận biết và phân tích được đặc điểm nhân vật Dế Mèn, Dế Choắt qua các chi tiết miêu tả ngoại hình, hành động, lời nói, tâm trạng.",
        "- Nhận biết từ đơn, từ phức (từ ghép, từ láy) và hiểu được tác dụng của việc sử dụng từ láy trong ngữ cảnh.",
        "- Viết được bài văn kể lại một trải nghiệm của bản thân có bố cục 3 phần rõ ràng.",
        "- Biết kể lại một trải nghiệm và lắng nghe tích cực, phản hồi phù hợp với tiêu chí rubric.",
        "### 2. Phẩm chất chủ yếu",
        "- Nhân ái: Biết yêu thương, tôn trọng sự khác biệt, đồng cảm với những người xung quanh.",
        "- Trách nhiệm: Nhận thức rõ trách nhiệm về lời nói và hành vi của mình đối với người khác.",
        "## II. TIẾN TRÌNH DẠY HỌC (BLENDED LEARNING)",
        "### Giai đoạn 1: Chuẩn bị trước giờ học (Trực tuyến trên LMS)",
        "- Học sinh truy cập LMS Ngữ văn 6, xem video giới thiệu chủ đề, đọc trước văn bản 'Bài học đường đời đầu tiên'.",
        "- Hoàn thành phiếu kiểm tra nhanh từ vựng và câu hỏi kích hoạt kiến thức nền.",
        "### Giai đoạn 2: Trực tiếp trên lớp (Tương tác tích cực)",
        "- Thảo luận nhóm về các chi tiết thể hiện tính cách Dế Mèn và bài học rút ra sau cái chết của Dế Choắt.",
        "- Thực hành nhận diện từ láy và vận dụng viết câu miêu tả.",
        "### Giai đoạn 3: Vận dụng và mở rộng (Sau giờ học)",
        "- Học sinh nộp bài viết trải nghiệm lên LMS, tham gia đánh giá đồng đẳng (peer-review) theo rubric."
    ]
)

# 02_Phieu_bai_tap_PISA.docx
create_docx(
    os.path.join(out_dir, "02_Phieu_bai_tap_PISA.docx"),
    "PHIẾU BÀI TẬP PHÁT TRIỂN NĂNG LỰC ĐỌC HIỂU THEO CHUẨN PISA",
    "Chủ đề: Bài học đường đời đầu tiên - Ngữ văn 6",
    [
        "## PHẦN 1: THU NHẬN THÔNG TIN (ACCESS AND RETRIEVE)",
        "Câu 1: Đoạn trích 'Bài học đường đời đầu tiên' được trích từ tác phẩm nào? Của tác giả nào?",
        "- Gợi ý trả lời: Tác phẩm 'Dế Mèn phiêu lưu ký' của nhà văn Tô Hoài.",
        "Câu 2: Liệt kê ít nhất 3 chi tiết miêu tả ngoại hình cường tráng của chàng Dế Mèn.",
        "- Gợi ý trả lời: Càng mẫm bóng, vuốt cứng và nhọn hoắt, đôi cánh dài chấm đuôi, đầu to và nổi từng tảng.",
        "## PHẦN 2: TÍCH HỢP VÀ SUY LUẬN (INTEGRATE AND INTERPRET)",
        "Câu 3: Vì sao Dế Mèn lại từ chối giúp Dế Choắt đào ngách thông sang nhà mình?",
        "- Gợi ý trả lời: Do tính kiêu căng, ngạo mạn, xem thường người yếu thế hơn mình.",
        "Câu 4: Phân tích tâm trạng của Dế Mèn sau khi trêu chị Cốc dẫn đến cái chết oan ức của Dế Choắt.",
        "- Gợi ý trả lời: Từ đắc ý, hợm hĩnh sang hoảng sợ, hối hận tột cùng, nhận ra thói hung hăng bậy bạ của mình.",
        "## PHẦN 3: PHẢN ÁNH VÀ ĐÁNH GIÁ (REFLECT AND EVALUATE)",
        "Câu 5: Nếu gặp một người bạn có tính cách kiêu căng giống Dế Mèn thời trẻ, em sẽ ứng xử như thế nào để giúp bạn thay đổi?"
    ]
)

# 03_De_kiem_tra_tong_ket.docx
create_docx(
    os.path.join(out_dir, "03_De_kiem_tra_tong_ket.docx"),
    "ĐỀ KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ BÀI 1",
    "Môn: Ngữ văn 6 - Thời gian làm bài: 90 phút (Kèm Ma trận & Hướng dẫn chấm)",
    [
        "## I. MA TRẬN ĐỀ KIỂM TRA",
        "- Phần Đọc hiểu (6.0 điểm): Trắc nghiệm 4 câu (2.0 điểm) + Tự luận 3 câu (4.0 điểm).",
        "- Phần Viết (4.0 điểm): Kể lại một trải nghiệm sâu sắc về tình bạn của bản thân.",
        "## II. ĐỀ BÀI CHI TIẾT",
        "### Phần I. Đọc hiểu (6.0 điểm)",
        "Đọc đoạn trích sau và trả lời các câu hỏi: 'Chao ôi, có biết đâu rằng: hung hăng, hống hách láo chỉ tổ đem thân mà trả nợ những cử chỉ ngu dại của mình thôi. Tôi đã phải trải cảnh như thế. Thoát nạn rồi, mà còn ân hận quá, ân hận mãi...'",
        "- Câu 1 (0.5đ): Xác định ngôi kể và người kể chuyện trong đoạn văn trên.",
        "- Câu 2 (0.5đ): Tìm 2 từ láy có trong đoạn văn và nêu tác dụng biểu đạt.",
        "- Câu 3 (1.0đ): Nêu ý nghĩa của lời tự vấn 'ân hận quá, ân hận mãi' của nhân vật tôi.",
        "### Phần II. Viết (4.0 điểm)",
        "Đề bài: Hãy viết bài văn (khoảng 1.5 - 2 trang) kể lại một kỉ niệm hoặc trải nghiệm đáng nhớ giữa em và một người bạn, qua đó em rút ra được bài học quý giá.",
        "## III. HƯỚNG DẪN CHẤM VÀ RUBRIC",
        "- Mở bài (0.5đ): Giới thiệu được trải nghiệm và bạn đồng hành.",
        "- Thân bài (2.5đ): Kể lại diễn biến sự việc mạch lạc, kết hợp cảm xúc và miêu tả chi tiết.",
        "- Kết bài (0.5đ): Nêu ý nghĩa trải nghiệm và bài học cho bản thân.",
        "- Chính tả, dùng từ, sáng tạo (0.5đ)."
    ]
)

# 04_Bai_giang_truc_tuyen.ppsx
create_ppsx(
    os.path.join(out_dir, "04_Bai_giang_truc_tuyen.ppsx"),
    "BÀI GIẢNG SỐ: TÔI VÀ CÁC BẠN",
    "Ngữ văn 6 - Bộ sách Kết nối tri thức với cuộc sống"
)

# 05_Phieu_bai_tap_tieng_Viet.docx
create_docx(
    os.path.join(out_dir, "05_Phieu_bai_tap_tieng_Viet.docx"),
    "PHIẾU BÀI TẬP THỰC HÀNH TIẾNG VIỆT",
    "Chuyên đề: Từ đơn, từ phức và nghĩa của từ trong ngữ cảnh",
    [
        "## PHẦN LÝ THUYẾT TRỌNG TÂM",
        "- Từ đơn: Là từ chỉ gồm một tiếng có nghĩa (Ví dụ: bàn, học, đi, đọc).",
        "- Từ phức: Là từ gồm hai hay nhiều tiếng, chia thành hai loại: Từ ghép và Từ láy.",
        "- Từ ghép: Các tiếng có quan hệ với nhau về mặt ngữ nghĩa (Ví dụ: sách vở, bạn bè, thầy cô).",
        "- Từ láy: Các tiếng có quan hệ láy âm với nhau (Ví dụ: long lanh, thoăn thoắt, rón rén).",
        "## BÀI TẬP VẬN DỤNG",
        "Bài 1: Phân loại các từ sau vào hai nhóm Từ ghép và Từ láy: dũng cảm, rón rén, chăm chỉ, bàn ghế, lung linh, học tập.",
        "Bài 2: Đặt câu với một từ láy miêu tả ngoại hình và một từ láy miêu tả tâm trạng."
    ]
)

# 06_De_kiem_tra_tieng_Viet.docx
create_docx(
    os.path.join(out_dir, "06_De_kiem_tra_tieng_Viet.docx"),
    "ĐỀ KIỂM TRA THƯỜNG XUYÊN TIẾNG VIỆT",
    "Thời gian: 15 phút - Kiểm tra năng lực vận dụng từ ngữ",
    [
        "## ĐỀ BÀI",
        "Câu 1 (4.0 điểm): Nêu sự khác biệt cơ bản giữa từ ghép và từ láy. Cho 2 ví dụ minh họa cho mỗi loại.",
        "Câu 2 (6.0 điểm): Viết đoạn văn ngắn (từ 4 đến 6 câu) chia sẻ cảm nghĩ về một người bạn thân, trong đó có sử dụng ít nhất 2 từ láy và 1 từ ghép. Gạch chân và chú thích rõ."
    ]
)

print("Created all 6 docx and ppsx files successfully in public/hoc_lieu/")
