import React, { useState } from "react";
import { X } from "lucide-react";

interface AddSkillDialogProps {
  open: boolean;
  onClose: () => void;
  onSkillAdded: (title: string) => void;
}

const AddSkillDialog: React.FC<AddSkillDialogProps> = ({ open, onClose, onSkillAdded }) => {
  const [title, setTitle] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSkillAdded(title);
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1E1C3A] w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add Skill Category</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name (e.g. Programming)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0F0E24] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            autoFocus
          />
          <button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-pink-500/25 transition disabled:opacity-50 flex items-center gap-2">
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSkillDialog;