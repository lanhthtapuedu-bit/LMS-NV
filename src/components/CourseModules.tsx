import React from 'react';
import { LessonData } from '../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface CourseModulesProps {
  lessons: LessonData[];
  onSelectLesson: (lesson: LessonData) => void;
}

export const CourseModules: React.FC<CourseModulesProps> = ({ lessons, onSelectLesson }) => {
  return (
    <section id="courses" className="py-16 md:py-20 bg-[#f7fbff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black tracking-widest text-[#1686d9] uppercase">
            Học theo chủ đề
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203c60] tracking-tight mt-2 mb-3">
            Khám phá 6 chuyên đề học tập
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Mỗi chuyên đề kết hợp học liệu trực tuyến trên LMS, nhiệm vụ học tập tương tác và hoạt động vận dụng thực tiễn trên lớp.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="bg-white rounded-3xl border border-sky-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Cover Gradient & Header */}
              <div
                className={`h-40 p-6 relative overflow-hidden flex items-end bg-gradient-to-br ${lesson.coverGradient}`}
              >
                {/* Decorative circular element */}
                <div className="absolute -right-6 -top-12 w-36 h-36 rounded-full bg-white/40 blur-xs pointer-events-none" />

                {/* Big Emoji / Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-3xl shadow-md shadow-sky-950/10 z-10 group-hover:scale-110 transition-transform duration-200">
                  {lesson.icon}
                </div>

                {/* Tag */}
                <span className="absolute z-10 right-5 bottom-5 text-[11px] font-black tracking-wider text-[#163d85] bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  {lesson.tag}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta: Category & Module number */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2.5">
                  <span className="uppercase tracking-wide text-[#1686d9]">
                    {lesson.category}
                  </span>
                  <span className="bg-sky-50 text-[#163d85] px-2 py-0.5 rounded-md font-mono text-[11px] border border-sky-100 font-bold">
                    {lesson.periodRange || lesson.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#203e64] leading-snug mb-2 group-hover:text-[#1686d9] transition-colors">
                  {lesson.title}
                </h3>


                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                  {lesson.description}
                </p>

                {/* Bottom Bar */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{lesson.periodRange || lesson.status}</span>
                  </span>

                  <button
                    onClick={() => onSelectLesson(lesson)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-[#1769aa] hover:bg-[#163d85] hover:text-white font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    <span>VÀO HỌC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
