import React, { useState } from "react";
import { 
  Plus, 
  MessageSquare, 
  Linkedin, 
  Youtube, 
  Facebook, 
  PlusCircle 
} from "lucide-react";
import PostCard from "../components/ui/PostCard"; // Importing your existing component

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Posts");

  const tabs = ["Posts", "Skills", "Projects", "Experience", "Education"];

  return (
    <div className="min-h-screen w-full bg-[#381B5E] p-4 md:p-8 flex items-center justify-center">
      
      {/* Main Container (The large dark purple card) */}
      <div className="w-full max-w-[1400px] bg-[#2E1065] rounded-[40px] p-6 md:p-10 shadow-2xl min-h-[85vh] flex flex-col relative overflow-hidden">
        
        {/* Top Gradient/Light Effect (Optional visual flair) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

        {/* --- HEADER NAVIGATION --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 z-10 gap-6">
          
          <div className="flex items-center gap-8 w-full md:w-auto">
            {/* Logo Text */}
            <h1 className="text-4xl font-cursive text-white italic font-bold">Hi,,</h1>
            
            {/* Plus Icon Button */}
            <button className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
              <Plus size={24} />
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-lg font-medium transition-all duration-300 relative pb-1 ${
                    activeTab === tab 
                      ? "text-white" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab}
                  {/* Active Underline Indicator */}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-8 h-1 bg-white rounded-full transition-all duration-300" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Hire Me Button */}
          <button className="bg-white text-[#2E1065] px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition shadow-lg">
            <MessageSquare className="fill-[#2E1065]" size={18} />
            Hire me
          </button>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 z-10 h-full">
          
          {/* LEFT: POSTS FEED (Span 8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Reusing your PostCard Component */}
            <PostCard
              avatarUrl="https://i.imgur.com/6VBx3io.jpeg" // Using the same image from your Split1 example
              name="Kamal"
              likes={54}
              time="08:20 PM"
              content={`Excited to share my new experience at the shoe store! I've been able to help customers find the perfect shoes and, at the same time, improve my sales skills. Every day is a new learning opportunity, and I'm loving this journey!

#SalesLife #CustomerFirst #ShoeStore #NewExperience #PassionForWork`}
              images={[
                "https://i.imgur.com/Sd0pV9N.jpeg",
                "https://i.imgur.com/4ZQZ4Q0.jpeg",
                "https://i.imgur.com/vRk5s8q.jpeg",
              ]}
              liked={true}
              onToggleLike={() => {}}
            />

          </div>

          {/* RIGHT: PROFILE SIDEBAR (Span 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            
            {/* Profile Picture */}
            <div className="relative mb-4">
              <div className="w-40 h-40 rounded-full p-[4px] bg-gradient-to-tr from-blue-400 to-purple-500">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#2E1065]"
                />
              </div>
            </div>

            {/* Follow Button */}
            <button className="bg-[#D4E936] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 mb-4 hover:bg-[#c3d632] transition">
              <PlusCircle size={18} className="text-black" />
              Follow
            </button>

            {/* Name & Title */}
            <h2 className="text-3xl font-bold text-white mb-2">Antor Hawlader</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Full-Stack MERN | Android Developer | UI/UX Designer
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-8">
              <SocialIcon icon={<Linkedin size={20} />} color="bg-[#0077B5]" />
              <SocialIcon icon={<Youtube size={20} />} color="bg-[#FF0000]" />
              <SocialIcon icon={<Facebook size={20} />} color="bg-[#1877F2]" />
            </div>

            <div className="text-left w-full">
              <h3 className="text-pink-500 text-xl font-bold mb-2">Location</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-3">Dhaka, Bangladesh</p>
            </div>

            {/* About Section */}
            <div className="text-left w-full">
              <h3 className="text-pink-500 text-xl font-bold mb-2">About</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                I am a passionate Software Developer specializing in Full-Stack MERN, Android Development, and UI/UX Design.
                <br /><br />
                For me, design is a top priority, no matter which stack or technology I use, I believe that a well-crafted design makes all the difference.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Social Icons to keep code clean
const SocialIcon = ({ icon, color }: { icon: React.ReactNode; color: string }) => (
  <button className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg`}>
    {icon}
  </button>
);

export default Profile;