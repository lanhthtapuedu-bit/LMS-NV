import React from 'react';
import { GraduationCap, MonitorSmartphone, Users2, BarChart3 } from 'lucide-react';

export const FeatureBand: React.FC = () => {
  const features = [
    {
      icon: <GraduationCap className="w-6 h-6 text-[#1686d9]" />,
      title: 'HỌC THEO LỘ TRÌNH',
      desc: 'Nội dung được sắp xếp theo chuyên đề, có định hướng trước – trong – sau giờ học.'
    },
    {
      icon: <MonitorSmartphone className="w-6 h-6 text-[#ff6b24]" />,
      title: 'HỌC TRÊN MỌI THIẾT BỊ',
      desc: 'Giao diện thích ứng hoàn hảo với máy tính để bàn, máy tính bảng và điện thoại thông minh.'
    },
    {
      icon: <Users2 className="w-6 h-6 text-emerald-600" />,
      title: 'HỖ TRỢ HỌC TẬP',
      desc: 'Kho phiếu học tập PISA, câu hỏi gợi ý và các nhiệm vụ trao đổi tích cực trên lớp.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      title: 'THEO DÕI KẾT QUẢ',
      desc: 'Có hoạt động luyện tập tương tác và hệ thống câu hỏi kiểm tra – đánh giá năng lực.'
    }
  ];

  return (
    <section className="bg-white py-12 border-y border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-[#f7fbff] hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4 border border-sky-100">
                {item.icon}
              </div>
              <h3 className="text-xs font-black tracking-wider text-[#163d85] mb-2 uppercase">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
