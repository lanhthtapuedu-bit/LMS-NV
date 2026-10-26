import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Lock, ShieldAlert, ArrowRight, UserCheck, LogIn } from 'lucide-react';
import { loginWithGoogle } from '../services/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    const p = password;

    // Check student/guest demo account from original project
    if (u === 'BAI1_NV6' && p === 'NHOM4@') {
      const studentUser: User = {
        username: 'BAI1_NV6',
        name: 'Học viên Ngữ văn 6',
        role: 'student',
        school: 'Trường THCS Thực nghiệm'
      };
      onLoginSuccess(studentUser);
      onClose();
      return;
    }

    // Check admin demo account
    if (u === 'ADMIN_NV6' && p === 'QUANTRIVIEN@2026') {
      const adminUser: User = {
        username: 'ADMIN_NV6',
        name: 'ADIM (Cô Tú Lành)',
        role: 'admin',
        school: 'ĐH Sư phạm – ĐH Đà Nẵng'
      };
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    setError('Tên đăng nhập hoặc mật khẩu chưa chính xác. Vui lòng thử lại!');
  };

  const handleQuickLogin = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setUsername('BAI1_NV6');
      setPassword('NHOM4@');
      setError(null);
    } else {
      setUsername('ADMIN_NV6');
      setPassword('QUANTRIVIEN@2026');
      setError(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle();
      const u = result.user;
      const googleUser: User = {
        username: u.email || 'lanhtht.apuedu@gmail.com',
        name: 'ADIM (Cô Tú Lành)',
        role: 'admin',
        school: 'K51 Ngữ văn – ĐH Sư phạm Đà Nẵng'
      };
      onLoginSuccess(googleUser);
      onClose();
    } catch (err: unknown) {
      console.warn('Lỗi đăng nhập Google:', err);
      // If user closed popup, don't show scary error
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('popup-closed-by-user')) {
        setError('Đăng nhập Google không thành công. Bạn có thể sử dụng tài khoản Demo bên dưới.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b2446]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-sky-100 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5a20] to-[#ff9b31] text-white flex items-center justify-center font-bold">
            6
          </div>
          <span className="font-extrabold text-lg text-[#163d85]">
            LMS <span className="text-[#ff6b24]">NGỮ VĂN 6</span>
          </span>
        </div>

        <h2 className="text-2xl font-black text-[#163d85] mt-3 mb-1">
          Chào mừng bạn trở lại!
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Đăng nhập để khám phá khóa học <strong>“Tôi và các bạn”</strong> hoặc quản lý học liệu.
        </p>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1686d9] focus:outline-hidden font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#ff6b24] to-[#ff8a28] hover:from-[#ea5c16] hover:to-[#ff7b18] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2"
          >
            <span>ĐĂNG NHẬP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google Sign In option */}
        <div className="mt-3">
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-slate-200 hover:border-[#1686d9] hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Đang kết nối Google...' : 'Đăng nhập với Google (Tài khoản Giáo viên)'}</span>
          </button>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 block mb-2">
            Hoặc đăng nhập nhanh bằng tài khoản Demo:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="px-2.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-[#1686d9] font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Học viên (BAI1_NV6)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2.5 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#ff6b24] font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Quản trị (ADMIN_NV6)</span>
            </button>
          </div>
        </div>

        {/* Security Notice (Requirement 8 & 9) */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Giới hạn bảo mật:</strong> Các tài khoản trên chỉ phục vụ mục đích kiểm thử và trình diễn. Trong môi trường trường học thực tế, hãy kết nối Firebase Authentication để quản lý mật khẩu an toàn.
          </span>
        </div>
      </div>
    </div>
  );
};
