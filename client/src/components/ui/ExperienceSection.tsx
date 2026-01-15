import React from "react";
import { Briefcase, Plus, Building2, Calendar, Trash2 } from "lucide-react";

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface ExperienceSectionProps {
  experience: Experience[];
  isMyProfile: boolean;
  onAdd: () => void;
  onDelete?: (index: number) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experience,
  isMyProfile,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="bg-[#1F1D47] rounded-3xl p-8 border border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Briefcase size={24} className="text-purple-500" />
          </div>
          Work Experience
        </h2>
        {isMyProfile && (
          <button
            onClick={onAdd}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-purple-500 rounded-full transition-all duration-300"
          >
            <span className="text-sm font-medium text-purple-400 group-hover:text-white">
              Add Job
            </span>
            <Plus size={16} className="text-purple-400 group-hover:text-white" />
          </button>
        )}
      </div>

      {experience.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {experience.map((exp, i) => (
            <div
              key={i}
              className="group relative bg-[#2A284D] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start hover:shadow-lg"
            >
              {/* Delete Button */}
              {isMyProfile && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(i);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/40 hover:text-red-500 hover:bg-white/10 transition z-10 opacity-0 group-hover:opacity-100"
                  title="Delete Experience"
                >
                  <Trash2 size={16} />
                </button>
              )}

              {/* Icon Box */}
              <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[#1F1D47] border border-white/10 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                <Building2 size={28} />
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2 pr-8">
                  <h3 className="text-white font-bold text-xl group-hover:text-purple-300 transition-colors">
                    {exp.position}
                  </h3>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Calendar size={12} className="text-white/50" />
                    <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                      {exp.duration}
                    </span>
                  </div>
                </div>

                <h4 className="text-purple-400 font-semibold text-sm mb-4 flex items-center gap-2">
                  {exp.company}
                </h4>

                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line bg-[#1F1D47]/50 p-4 rounded-xl border border-white/5">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <Briefcase className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <p className="text-white/40 italic">Add your professional journey.</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;