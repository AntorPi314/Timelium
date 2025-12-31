import React from "react";

interface SearchProfileCardProps {
  name: string;
  tags: string[];
  avatar: string;
  onView?: () => void;
  onTagClick?: (tag: string) => void;
}

const SearchProfileCard: React.FC<SearchProfileCardProps> = ({
  name,
  tags,
  avatar,
  onView,
  onTagClick,
}) => {
  return (
    <div className="w-[90%] bg-[#1F1D47] rounded-2xl my-2 py-2 px-4 flex items-center justify-between shadow-md hover:bg-[#252355] transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
        />

        {/* Name + Tags */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-white leading-tight">{name}</h2>
          
          {/* Updated Tag Styling */}
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    if (onTagClick) onTagClick(tag);
                  }}
                  className="text-[11px] font-medium text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full cursor-pointer border border-pink-500/20 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No skills</span>
            )}
            
            
            {tags.length > 3 && (
               <span className="text-[10px] text-gray-500 flex items-center">+{tags.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* View Button (Same as before) */}
      <button
        onClick={onView}
        className="px-5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-pink-500/30"
      >
        View
      </button>
    </div>
  );
};

export default SearchProfileCard;