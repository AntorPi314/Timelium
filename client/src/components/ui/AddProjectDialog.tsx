import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onProjectAdded?: () => void;
}

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ open, onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return toast.error("Title and description are required.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add projects.");
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
        link: formData.link || null,
      };

      await axios.post(`${API_URL}/users/projects`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Project added successfully!");
      setFormData({ title: "", description: "", technologies: "", link: "" });
      
      if (onProjectAdded) onProjectAdded();
      onClose(); 

    } catch (error) {
      console.error("Project add error:", error);
      toast.error("Failed to add project.");
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
            <h2 className="text-xl font-bold text-white">Add New Project</h2>
            <Dialog.Close className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </Dialog.Close>
          </div>

          <div className="p-6 overflow-y-auto space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Project Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title} 
                onChange={handleChange}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Description *</label>
              <textarea 
                name="description"
                value={formData.description} 
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Technologies (comma-separated)</label>
              <input 
                type="text" 
                name="technologies"
                value={formData.technologies} 
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Project Link (optional)</label>
              <input 
                type="url" 
                name="link"
                value={formData.link} 
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-[#0F0E24] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
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
              Add Project
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddProjectDialog;