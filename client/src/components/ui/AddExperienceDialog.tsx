import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface AddExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onExperienceAdded?: () => void;
}

const AddExperienceDialog: React.FC<AddExperienceDialogProps> = ({ open, onClose, onExperienceAdded }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    duration: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.company.trim() || !formData.position.trim()) {
      return toast.error("Company and position are required.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add experience.");
        return;
      }

      await axios.post(`${API_URL}/users/experience`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Experience added successfully!");
      setFormData({ company: "", position: "", duration: "", description: "" });
      
      if (onExperienceAdded) onExperienceAdded();
      onClose(); 

    } catch (error) {
      console.error("Experience add error:", error);
      toast.error("Failed to add experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-[#1F1D47] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#2A284D]">
            <h2 className="text-xl font-bold text-white">Add Experience</h2>
            <Dialog.Close className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </Dialog.Close>
          </div>

          <div className="p-6 overflow-y-auto space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Company Name *</label>
              <input 
                type="text" 
                name="company"
                value={formData.company} 
                onChange={handleChange}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Position *</label>
              <input 
                type="text" 
                name="position"
                value={formData.position} 
                onChange={handleChange}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Duration</label>
              <input 
                type="text" 
                name="duration"
                value={formData.duration} 
                onChange={handleChange}
                placeholder="Jan 2022 - Present"
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Description</label>
              <textarea 
                name="description"
                value={formData.description} 
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>
          </div>

          <div className="p-5 border-t border-white/10 bg-[#2A284D] flex justify-end gap-3">
            <Dialog.Close className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition">Cancel</Dialog.Close>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Add Experience
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddExperienceDialog;