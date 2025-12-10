import React, { useState } from "react";
import { Heart, Trash, AlertTriangle, X } from "lucide-react";

type PostCardProps = {
  avatarUrl: string;
  name: string;
  likes?: number;
  time?: string;
  content: string;
  images?: string[];
  liked?: boolean;
  onToggleLike?: () => void;
  onDelete?: () => void;
};

const PostCard: React.FC<PostCardProps> = ({
  avatarUrl,
  name,
  likes = 0,
  time = "",
  content,
  images = [],
  onToggleLike,
  onDelete,
  liked = false,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="w-full max-w-3xl bg-slate-50/90 rounded-2xl p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] relative transition-all hover:shadow-xl">
        
        {/* Top Right Action Buttons */}
        <div className="absolute right-5 top-5 flex items-center gap-3">
          
          {/* ✅ Delete Button (Only shows if onDelete is passed) */}
          {onDelete && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-50 transition group"
              title="Delete Post"
            >
              <Trash
                size={18}
                className="text-gray-400 group-hover:text-red-500 transition"
                strokeWidth={2}
              />
            </button>
          )}

          {/* ✅ Like Button */}
          <button
            onClick={onToggleLike}
            className="flex items-center justify-center"
            title="Like Post"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transform transition active:scale-95 ${
                liked ? "bg-rose-500" : "bg-white"
              }`}
            >
              <Heart
                size={22}
                className={liked ? "text-white" : "text-rose-500"}
                strokeWidth={1.6}
                fill={liked ? "currentColor" : "none"}
              />
            </div>
          </button>
        </div>

        {/* Header: avatar, name, meta */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={avatarUrl}
            alt={`${name} avatar`}
            className="w-12 h-12 rounded-full object-cover border border-white/40 shadow-sm"
          />
          <div className="flex-1">
            <div className="text-slate-800 font-semibold">{name}</div>
            <div className="text-slate-500 text-sm">
              {likes} Liked <span className="mx-1">|</span> {time}
            </div>
          </div>
        </div>

        {/* Content text */}
        <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
          {content}
        </p>

        {/* Images area */}
        {images.length > 0 && (
          <div className="mb-2">
            {images.length === 1 ? (
              <div className="w-full">
                <img
                  src={images[0]}
                  alt="post image"
                  className="rounded-lg object-cover w-full max-h-96"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.slice(0, 3).map((src, i) => (
                  <div
                    key={i}
                    className={`rounded-lg overflow-hidden relative ${
                      i === 0 ? "col-span-2 row-span-2" : "col-span-1"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`post image ${i + 1}`}
                      className="w-full h-full object-cover min-h-[150px]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Custom Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1F1D47] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Confirm Delete
              </h3>
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-medium shadow-lg shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;