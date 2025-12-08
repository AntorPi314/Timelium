import React from "react";

interface SearchProfileCardProps {
  name: string;
  tags: string[];
  avatar: string;
  onView?: () => void;
}

const SearchProfileCard: React.FC<SearchProfileCardProps> = ({
  name,
  tags,
  avatar,
  onView,
}) => {
  return (
    <div className="w-[90%] bg-[#1F1D47] rounded-2xl my-2 py-2 px-4 flex items-center justify-between shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
        />

        {/* Name + Tags */}
        <div>
          <h2 className="text-1xl font-semibold text-white">{name}</h2>
          <p className="text-sm text-gray-300">
            {tags.map((tag) => `#${tag} `)}
          </p>
        </div>
      </div>

      {/* View Button */}
      <button
        onClick={onView}
        className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition-all"
      >
        View
      </button>
    </div>
  );
};

export default SearchProfileCard;
