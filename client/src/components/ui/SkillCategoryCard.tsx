import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

interface SkillCategoryCardProps {
  id: number;
  title: string;
  items: string[];
  isMyProfile: boolean;
  onDeleteCard: () => void;
  onAddItem: (item: string) => void;
  onDeleteItem: (index: number) => void;
}

const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({
  title,
  items,
  isMyProfile,
  onDeleteCard,
  onAddItem,
  onDeleteItem,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    onAddItem(newItem);
    setNewItem("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <div className="bg-[#1E1C3A] rounded-2xl p-6 border border-white/10 shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full">
      {/* Header with dynamic divider */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white tracking-wide w-fit">
            {title}
          </h2>

          {/* Divider width = title width */}
          <div className="h-[2px] w-full bg-cyan-400 mt-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>

        {isMyProfile && (
          <button
            onClick={onDeleteCard}
            className="text-white/20 hover:text-red-500 transition p-1"
            title="Delete Category"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#2A284D] px-4 py-2 rounded-full border border-white/5 text-sm font-medium text-gray-200 group hover:border-cyan-500/50 hover:text-white transition-all"
            >
              {item}
              {isMyProfile && (
                <button
                  onClick={() => onDeleteItem(index)}
                  className="text-white/20 hover:text-red-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Skill"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-white/30 text-sm italic">No skills added yet.</p>
        )}
      </div>

      {/* Add Item Input */}
      {isMyProfile && (
        <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
          <input
            type="text"
            placeholder="Add skill..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-lg bg-[#0F0E24] border border-white/10 outline-none focus:border-cyan-500 text-sm text-white placeholder-white/30 transition"
          />
          <button
            onClick={handleAddItem}
            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-black transition"
            title="Add Skill"
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillCategoryCard;
