import React, { useState } from "react";
import PostCard from "../components/ui/PostCard";

const Split1 = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="w-[43%] h-full bg-[#33175B] flex flex-col">

      {/* Header */}
      <div className="w-full h-14 flex items-center justify-center border-b border-white/10">
        <h2 className="text-white text-2xl font-semibold tracking-wide">
          For you
        </h2>
      </div>

      {/* Posts Scroll Section */}
      <div className="flex-1 w-full px-6 py-8 space-y-8 overflow-y-auto scrollbar-thin">
        
        <PostCard
          avatarUrl="https://i.imgur.com/6VBx3io.jpeg"
          name="Kamal"
          likes={54}
          time="08:20 PM"
          content="Excited to share my new experience at the shoe store! I've been able to help customers find the perfect shoes and, at the same time, improve my sales skills. Every day is a new learning opportunity, and I'm loving this journey!"
          images={[
            "https://i.imgur.com/Sd0pV9N.jpeg",
            "https://i.imgur.com/4ZQZ4Q0.jpeg",
            "https://i.imgur.com/vRk5s8q.jpeg",
          ]}
          liked={liked}
          onToggleLike={() => setLiked((prev) => !prev)}
        />

        <PostCard
          avatarUrl="https://i.imgur.com/6VBx3io.jpeg"
          name="Kamal"
          likes={54}
          time="08:20 PM"
          content="Excited to share my new experience at the shoe store! I've been able to help customers find the perfect shoes and, at the same time, improve my sales skills. Every day is a new learning opportunity, and I'm loving this journey!"
          images={["https://i.imgur.com/Sd0pV9N.jpeg"]}
        />
      </div>
    </div>
  );
};

export default Split1;
