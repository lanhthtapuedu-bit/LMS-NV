import React from 'react';
import { ArrowRight, BookOpen, Layers, CheckCircle2, Settings } from 'lucide-react';

interface HeroProps {
  onExploreCourses: () => void;
  onExploreResources: () => void;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCourses,
  onExploreResources,
  onOpenAdmin,
  isAdmin
}) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#3b9fe4] via-[#61bdef] to-[#93d6f3] text-white">
      {/* Background radial soft shapes */}
      <div className="absolute -right-32 -top-40 w-[600px] h-[600px] rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-48 w-[400px] h-[400px] rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-sky-100 bg-white/15 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#ff9b31]" />
              <span>Không gian học tập số · Lớp 6</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white text-balance">
              Tôi và các bạn
              <span className="block text-[#163d85] drop-shadow-xs">
                Khám phá thế giới tình bạn
              </span>
            </h1>

            <p className="text-base sm:text-lg text-sky-50/90 leading-relaxed max-w-2xl font-normal">
              Cùng đọc, khám phá nhân vật, hiểu sức mạnh của ngôn từ và học cách trân trọng những khác biệt qua{' '}
              <strong className="font-bold text-white underline decoration-[#ff9b31] decoration-2 underline-offset-4">
                Bài 1 – bộ sách Kết nối tri thức với cuộc sống
              </strong>
              .
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCourses}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:from-[#f45c12] hover:to-[#ff7b18] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>KHÁM PHÁ KHÓA HỌC</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreResources}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#163d85] hover:bg-[#12316d] text-white font-extrabold text-sm rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>KHO HỌC LIỆU</span>
              </button>

              {isAdmin && onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 px-5 py-3.5 bg-white text-[#163d85] hover:bg-sky-50 font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#ff6b24]" />
                  <span>QUẢN LÝ HỌC LIỆU</span>
                </button>
              )}
            </div>

            {/* Badges / Metrics */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-bold text-[#163d85]">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xs">
                <span className="text-[#ff6b24] font-black text-sm">✦</span>
                <span>Ma trận 13 tiết chuẩn</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>30% Trực tuyến (250,71p) · 70% Trực tiếp (585p)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xs">
                <span className="text-[#1686d9] font-black text-base">📖</span>
                <span>Kết nối tri thức với cuộc sống</span>
              </div>
            </div>
          </div>

          {/* Right Column: Book Cover & Interactive Visual Presentation */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Back card with SGK Cover & Robot Illustration */}
              <div className="relative bg-white/95 rounded-3xl p-5 shadow-2xl shadow-sky-950/20 border border-white/60">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-black text-sky-800 tracking-wide uppercase">
                    Ngữ văn 6 · Tập 1
                  </span>
                </div>

                {/* Media Preview: Real Book Cover + Artwork */}
                <div className="mt-4 grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-6 relative rounded-2xl overflow-hidden shadow-md group">
                    <img
                      src="/assets/bia-sgk-ngu-van-6.png"
                      alt="Bìa sách giáo khoa Ngữ văn 6 - Kết nối tri thức với cuộc sống"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[11px] font-bold text-white leading-tight">
                        Bộ sách Kết nối tri thức
                      </span>
                    </div>
                  </div>

                  <div className="col-span-6 flex flex-col gap-2.5">
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-100 text-left">
                      <div className="text-[11px] font-black text-amber-800 uppercase">
                        Chủ đề Bài 1
                      </div>
                      <div className="text-sm font-bold text-[#163d85] mt-0.5">
                        Tôi và các bạn
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        6 chuyên đề học tập số
                      </div>
                    </div>

                    <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-100 text-left">
                      <div className="text-[11px] font-black text-sky-800 uppercase">
                        Văn bản trọng tâm
                      </div>
                      <div className="text-xs font-bold text-[#163d85] mt-0.5">
                        Bài học đường đời đầu tiên
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Tô Hoài (Dế Mèn phiêu lưu ký)
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-left">
                      <div className="text-[11px] font-black text-emerald-800 uppercase">
                        Hình thức tổ chức
                      </div>
                      <div className="text-xs font-bold text-emerald-900 mt-0.5">
                        Dạy học kết hợp (30% – 70%)
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        250,71p LMS + 585p Trực tiếp
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Feature bar */}
                <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-semibold text-[#163d85]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Hệ thống LMS sẵn sàng
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    K51 Sư phạm Đà Nẵng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
