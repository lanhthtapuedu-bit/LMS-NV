import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, ShieldCheck, UserCircle, LogOut, LogIn, Menu, X, Settings, Eye, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  isAdminWorkspace?: boolean;
  onToggleAdminWorkspace?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  isAdminWorkspace = false,
  onToggleAdminWorkspace
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => {
            if (isAdminWorkspace && onToggleAdminWorkspace) {
              onToggleAdminWorkspace();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left focus:outline-hidden group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff5a20] via-[#ff7c28] to-[#ff9b31] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#163d85] leading-none">
              LMS <span className="text-[#ff6b24]">NGỮ VĂN 6</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 mt-1">
              {isAdmin && isAdminWorkspace ? 'Khu vực Quản trị Học liệu' : 'Tôi và các bạn · Kết nối tri thức'}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {isAdmin && isAdminWorkspace ? (
            /* Admin Focused Navigation: Only Management & Switch View */
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 text-[#ff6b24] font-extrabold text-xs border border-orange-200">
                <Settings className="w-4 h-4 text-[#ff6b24]" />
                <span>QUẢN LÝ HỌC LIỆU</span>
              </span>

              {onToggleAdminWorkspace && (
                <button
                  onClick={onToggleAdminWorkspace}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#1686d9] hover:bg-sky-50 text-xs font-bold transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem giao diện Học sinh</span>
                </button>
              )}
            </div>
          ) : (
            /* Normal Student Navigation */
            <>
              <button
                onClick={() => {
                  document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="transition-colors hover:text-[#1686d9] cursor-pointer"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="transition-colors hover:text-[#1686d9] cursor-pointer"
              >
                Chuyên đề
              </button>
              <button
                onClick={() => {
                  document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="transition-colors hover:text-[#1686d9] cursor-pointer"
              >
                Kho học liệu
              </button>
              <button
                onClick={() => {
                  document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="transition-colors hover:text-[#1686d9] cursor-pointer"
              >
                Đội ngũ
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-sky-50/80 border border-sky-100 rounded-xl px-3 py-1.5">
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-[#ff6b24]" />
                ) : (
                  <UserCircle className="w-4 h-4 text-[#1686d9]" />
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#163d85] leading-none">
                    {isAdmin ? 'ADIM (Cô Tú Lành)' : currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isAdmin ? 'Quản trị viên' : 'Học viên'}
                  </span>
                </div>
              </div>

              {/* If Admin is in previewing student mode, show button to return to workspace */}
              {isAdmin && !isAdminWorkspace && onToggleAdminWorkspace && (
                <button
                  onClick={onToggleAdminWorkspace}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#163d85] hover:bg-[#12316d] text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
                  title="Quay lại giao diện Quản lý học liệu"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Về Quản lý học liệu</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 text-xs font-bold text-[#163d85] bg-sky-50/80 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer"
              >
                Tài khoản
              </button>
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:shadow-md hover:shadow-orange-500/25 rounded-xl transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ĐĂNG NHẬP</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-sky-50 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-sky-100 px-4 py-4 flex flex-col gap-3 text-xs">
          {isAdmin && isAdminWorkspace ? (
            <>
              <div className="py-2 text-[#ff6b24] font-bold">
                Khu vực Quản trị học liệu
              </div>
              {onToggleAdminWorkspace && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleAdminWorkspace();
                  }}
                  className="text-left py-2 font-semibold text-[#1686d9]"
                >
                  Xem giao diện Học sinh
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left py-2 font-semibold text-slate-700"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left py-2 font-semibold text-slate-700"
              >
                Các chuyên đề
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left py-2 font-semibold text-slate-700"
              >
                Kho học liệu số
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left py-2 font-semibold text-slate-700"
              >
                Đội ngũ thực hiện
              </button>
              {isAdmin && onToggleAdminWorkspace && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleAdminWorkspace();
                  }}
                  className="text-left py-2 font-bold text-[#ff6b24]"
                >
                  Về Quản lý học liệu
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};
