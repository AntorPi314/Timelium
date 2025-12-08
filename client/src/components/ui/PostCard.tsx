// src/components/PostCard.tsx
import React from "react";
import { Heart } from "lucide-react";

type PostCardProps = {
  avatarUrl: string;
  name: string;
  likes?: number;
  time?: string;
  content: string;
  images?: string[]; 
  onToggleLike?: () => void;
  liked?: boolean;
};

const PostCard: React.FC<PostCardProps> = ({
  avatarUrl,
  name,
  likes = 0,
  time = "",
  content,
  images = [],
  onToggleLike,
  liked = false,
}) => {
  return (
    <div className="w-full max-w-3xl bg-slate-50/90 rounded-2xl p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] relative">
      {/* Heart icon top-right */}
      <button
        onClick={onToggleLike}
        aria-label="like"
        className="absolute right-5 top-5 flex items-center justify-center"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transform transition ${
            liked ? "bg-rose-500" : "bg-white"
          }`}
        >
          <Heart
            size={22}
            className={liked ? "text-white" : "text-rose-500"}
            strokeWidth={1.6}
          />
        </div>
      </button>

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
            <div className="w-60 md:w-72 lg:w-80">
              <img
                src={images[0]}
                alt="post image"
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
          ) : (
            // multi-image grid (max 3 shown like mock)
            <div className="grid grid-cols-3 gap-3">
              {images.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className={`rounded-lg overflow-hidden ${
                    i === 0 ? "col-span-1 row-span-2" : "col-span-1"
                  }`}
                  style={{
                    // make first image larger like the mock (optional)
                    minHeight: i === 0 ? 180 : 100,
                  }}
                >
                  <img
                    src={src}
                    alt={`post image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
