import React from 'react';
import { BookOpen } from 'lucide-react';

interface FooterProps {
  onNavClick: (targetId: string) => void;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenAdmin, isAdmin }) => {
  return (
    <footer className="bg-[#173e70] text-[#e7f4ff] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Introduction */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff5a20] to-[#ff9b31] flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                LMS · <span className="text-[#ff9b31]">NGỮ VĂN 6</span>
              </span>
            </div>
            <p className="text-xs text-sky-100/80 leading-relaxed max-w-sm">
              Không gian học tập số cho Bài 1: <em>Tôi và các bạn</em>, bộ sách Kết nối tri thức với cuộc sống.
            </p>
            <p className="text-[11px] text-sky-200/60 leading-relaxed">
              Dự án Dạy học số – Nhóm Học viên Cao học K51 – Chuyên ngành Lí luận và PPDH Bộ môn Ngữ văn – Trường Đại học Sư phạm, Đại học Đà Nẵng.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-black tracking-widest uppercase text-white">
              KHÁM PHÁ
            </h3>
            <ul className="space-y-2 text-xs text-sky-100/80">
              <li>
                <button
                  onClick={() => onNavClick('courses')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Các chuyên đề học tập
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('resources')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kho học liệu số
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('team')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Đội ngũ thực hiện
                </button>
              </li>
              {isAdmin && onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#ff9b31] font-bold hover:underline cursor-pointer"
                  >
                    Cổng quản trị học liệu
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Course Metadata */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-black tracking-widest uppercase text-white">
              THÔNG TIN KHÓA HỌC
            </h3>
            <div className="text-xs text-sky-100/80 space-y-1.5 leading-relaxed">
              <p>• Học phần: <strong className="text-white">Dạy học số trong môn Ngữ văn</strong></p>
              <p>• Đối tượng: <strong className="text-white">Học sinh lớp 6 THCS</strong></p>
              <p>• Hình thức: <strong className="text-white">Dạy học kết hợp (Blended Learning)</strong></p>
              <p>• Nền tảng: <strong className="text-white">LMS Web Responsive</strong></p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 text-center text-xs text-sky-200/60 font-medium flex items-center justify-center">
          <span>© LMS Ngữ văn 6</span>
        </div>
      </div>
    </footer>
  );
};
