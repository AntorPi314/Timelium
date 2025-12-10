import React, { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Image, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedFile) {
      return toast.error("Please write something or add an image.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to post.");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post created successfully!");
      
      setContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      
      if (onPostCreated) onPostCreated();
      onClose(); 

    } catch (error) {
      console.error("Post error:", error);
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-[#1F1D47] rounded-2xl border border-white/10 shadow-2xl p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <h2 className="text-xl font-bold text-white">Create Post</h2>
            <Dialog.Close className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </Dialog.Close>
          </div>

          {/* Text Input */}
          <textarea
            className="w-full bg-[#0F0E24] text-white p-4 rounded-xl outline-none resize-none min-h-[120px] placeholder-gray-500 border border-white/5 focus:border-pink-500 transition"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative mt-4 rounded-xl overflow-hidden border border-white/10">
              <img src={previewUrl} alt="Preview" className="w-full object-cover max-h-60" />
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-4 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <Image size={20} />
              <span className="text-sm font-medium">Add Photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-pink-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Post
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePostDialog;