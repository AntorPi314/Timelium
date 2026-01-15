import React from "react";
import { GraduationCap, Plus, BookOpen, Trash2 } from "lucide-react";

interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

interface EducationSectionProps {
  education: Education[];
  isMyProfile: boolean;
  onAdd: () => void;
  onDelete?: (index: number) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  isMyProfile,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="bg-[#1F1D47] rounded-3xl p-8 border border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <GraduationCap size={24} className="text-green-500" />
          </div>
          Education
        </h2>
        {isMyProfile && (
          <button
            onClick={onAdd}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-green-500 rounded-full transition-all duration-300"
          >
            <span className="text-sm font-medium text-green-400 group-hover:text-white">
              Add Edu
            </span>
            <Plus size={16} className="text-green-400 group-hover:text-white" />
          </button>
        )}
      </div>

      {education.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {education.map((edu, i) => (
            <div
              key={i}
              className="group relative bg-[#2A284D] p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Delete Button */}
              {isMyProfile && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(i);
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/20 rounded-full text-white/40 hover:text-red-500 hover:bg-white/10 transition z-10 opacity-0 group-hover:opacity-100"
                  title="Delete Education"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="flex items-start gap-4">
                <div className="mt-1 p-3 bg-[#1F1D47] rounded-xl border border-white/10 group-hover:border-green-500/50 transition-colors">
                  <BookOpen
                    size={20}
                    className="text-white/60 group-hover:text-green-400"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1 pr-6">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-green-300 transition-colors">
                      {edu.degree}
                    </h3>
                  </div>

                  <p className="text-green-400/90 text-sm font-medium mb-3">
                    {edu.institution}
                  </p>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
                      <span className="text-white/40">Field</span>
                      <span className="text-white/80 font-medium text-right">
                        {edu.field}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
                      <span className="text-white/40">Year</span>
                      <span className="text-white/80 font-medium bg-white/5 px-2 py-0.5 rounded text-right">
                        {edu.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <GraduationCap className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <p className="text-white/40 italic">
            Share your academic achievements.
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationSection;