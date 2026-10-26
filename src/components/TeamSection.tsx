import React from 'react';
import { TEAM_MEMBERS } from '../data/initialData';
import { GraduationCap, Award } from 'lucide-react';

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="py-16 md:py-20 bg-gradient-to-b from-[#f2f9ff] via-[#eaf5ff] to-[#f4f9fd] border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Information Credit Banner (Requirement 3 & 6) */}
        <div className="max-w-4xl mx-auto bg-white border border-sky-100 rounded-3xl p-6 sm:p-7 text-center shadow-md mb-12 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#1686d9] mb-2.5">
            <Award className="w-4 h-4 text-[#ff6b24]" />
            <span>Thông tin sản phẩm</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed max-w-3xl mx-auto">
            Sản phẩm được tạo bởi nhóm Học viên Cao học – K51 – Chuyên ngành: Lí luận Phương pháp dạy học Bộ môn Ngữ văn – Trường Đại học Sư phạm – Đại học Đà Nẵng.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>Học phần: Dạy học số</span>
            <span>·</span>
            <span>Hình thức: Blended Learning</span>
            <span>·</span>
            <span>Bộ sách: Kết nối tri thức với cuộc sống</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black tracking-widest text-[#1686d9] uppercase">
            Đội ngũ thực hiện
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203c60] tracking-tight mt-2 mb-3">
            Thông tin giáo viên & Nhóm thiết kế
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Nhóm thực hiện khóa học kết hợp Ngữ văn 6 · Bài 1: Tôi và các bạn
          </p>
        </div>

        {/* 4 Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="bg-white rounded-3xl border border-sky-100 p-6 text-center shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center"
            >
              {/* Avatar SVG */}
              <div
                className="w-24 h-24 rounded-3xl mb-4 p-2 flex items-center justify-center shadow-inner overflow-hidden"
                style={{ backgroundColor: member.colorBg }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
                  <circle cx="50" cy="37" r="21" fill="#f2c4a2" />
                  <path
                    d="M28 40Q24 12 50 13Q75 14 72 41L62 28L43 30L30 42"
                    fill="#4d426d"
                  />
                  <path
                    d="M15 100Q17 61 50 61Q83 61 85 100"
                    fill={member.avatarAccent}
                  />
                </svg>
              </div>

              {/* Tag */}
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1686d9] mb-1">
                {member.label}
              </span>

              {/* Name */}
              <h3 className="text-xl font-black text-[#203d63] mb-1">
                {member.name}
              </h3>

              {/* Role */}
              <div className="text-xs font-bold text-[#486b91] mb-3">
                {member.role}
              </div>

              {/* Info & Academic */}
              <div className="mt-auto w-full pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p className="font-medium">{member.subject}</p>
                <p className="font-semibold text-slate-700">{member.academic}</p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {member.university}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
