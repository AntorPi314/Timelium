import React from "react";
import { Edit2, Trash2, Code2 } from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface SkillCardProps {
  skill: Skill;
  isMyProfile: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  isMyProfile,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-[#2A284D] border border-white/10 rounded-xl p-5 relative group hover:border-pink-500/50 transition-all duration-300">
      {/* Edit/Delete Overlay for Owner */}
      {isMyProfile && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 bg-white/10 rounded-lg hover:bg-pink-500 text-white transition"
            title="Edit Skill"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-white/10 rounded-lg hover:bg-red-500 text-white transition"
            title="Delete Skill"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Icon & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
            <Code2 className="text-pink-400" size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              {skill.name}
            </h3>
            <span className="text-white/40 text-xs font-medium">
              Expertise
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-white/60">Proficiency</span>
            <span className="text-pink-400">{skill.level}%</span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;