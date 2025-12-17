import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface AddSkillDialogProps {
  open: boolean;
  onClose: () => void;
  onSkillAdded?: () => void;
}

const AddSkillDialog: React.FC<AddSkillDialogProps> = ({ open, onClose, onSkillAdded }) => {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleSubmit = async () => {
    if (!skill.trim()) {
      return toast.error("Please enter a skill.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add skills.");
        return;
      }

      await axios.post(`${API_URL}/users/skills`, 
        { skill: skill.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Skill added successfully!");
      setSkill("");
      
      if (onSkillAdded) onSkillAdded();
      onClose(); 

    } catch (error) {
      console.error("Skill add error:", error);
      toast.error("Failed to add skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#1F1D47] rounded-2xl border border-white/10 shadow-2xl p-6">
          
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <h2 className="text-xl font-bold text-white">Add New Skill</h2>
            <Dialog.Close className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </Dialog.Close>
          </div>

          <input
            type="text"
            className="w-full bg-[#0F0E24] text-white p-4 rounded-xl outline-none placeholder-gray-500 border border-white/5 focus:border-pink-500 transition"
            placeholder="Enter skill name (e.g., React, Python)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />

          <div className="flex justify-end items-center mt-6 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-pink-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Add Skill
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddSkillDialog;