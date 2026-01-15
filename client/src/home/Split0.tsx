import { useState, useEffect } from "react";
import { Home, User, PlusCircle, LogOut, UserCircle, Compass, Sparkles, Search, X } from "lucide-react";
import LoginSignUpCard from "../components/ui/LoginSignUpCard";
import CreatePostDialog from "../components/ui/CreatePostDialog";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Split0 = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // New State for Search
  const [postSearch, setPostSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('user-update', checkUser);
    return () => {
        window.removeEventListener('storage', checkUser);
        window.removeEventListener('user-update', checkUser);
    };
  }, [openLogin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleProfileClick = () => {
    if (user?.username) {
      navigate(`/${user.username}`);
    }
    setShowDropdown(false);
  };

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleCreatePostClick = () => {
    if (!user) {
      toast.error("Please login to create a post");
    } else {
      setIsCreatePostOpen(true);
    }
  };

  // --- NEW: Handle Search Logic ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostSearch(val);
    // Dispatch event so Split1 can listen and filter posts
    const event = new CustomEvent('post-search-trigger', { detail: val });
    window.dispatchEvent(event);
  };

  const handleTagClick = (tag: string) => {
    setPostSearch(tag);
    // Auto Trigger Search for this tag
    const event = new CustomEvent('post-search-trigger', { detail: tag });
    window.dispatchEvent(event);
  };

  const clearSearch = () => {
    setPostSearch("");
    const event = new CustomEvent('post-search-trigger', { detail: "" });
    window.dispatchEvent(event);
  };
  // --------------------------------

  const trendingTags = ["Development", "AI Revolution", "Design", "Tech Life", "ReactJS", "Career"];

  return (
    <div className="w-[30%] h-full bg-[#381B5E] relative flex flex-col justify-between">

      {/* TOP NAVIGATION */}
      <div className="w-[85%] h-15 mt-8 px-8 flex items-center bg-gradient-to-r from-purple-700 via-purple-700 to-purple-900 rounded-tr-[30px] rounded-br-[30px] shadow-lg shrink-0">
        
        <p className="text-5xl text-fuchsia-600 font-medium cursor-pointer" onClick={handleHomeClick}>T</p>

        <div className="w-full flex justify-end items-center relative">
          
          <PlusCircle 
            onClick={handleCreatePostClick}
            className="w-8 h-auto text-white mr-4 cursor-pointer hover:text-pink-500 transition" 
          />
          
          <Home 
            onClick={handleHomeClick}
            className="w-8 h-auto text-white mr-4 cursor-pointer hover:text-pink-500 transition" 
          />
          
          {user ? (
            <div className="relative">
              <img 
                src={user.avatar || "https://i.imgur.com/6VBx3io.jpeg"} 
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/50 cursor-pointer object-cover hover:border-pink-500 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {showDropdown && (
                <div className="absolute right-0 top-12 w-40 bg-[#1F1D47] rounded-xl shadow-xl border border-white/10 z-50 overflow-hidden">
                  <div 
                    onClick={handleProfileClick}
                    className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer flex items-center gap-2 transition"
                  >
                    <UserCircle size={18} /> Profile
                  </div>
                  <div 
                    onClick={handleLogout}
                    className="px-4 py-3 text-red-400 hover:bg-white/10 cursor-pointer flex items-center gap-2 transition border-t border-white/5"
                  >
                    <LogOut size={18} /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <User
              onClick={() => setOpenLogin(true)}
              className="w-8 h-auto text-white cursor-pointer hover:text-pink-500 transition"
            />
          )}
        </div>
      </div>

      {/* NEW: BOTTOM SECTION */}
      <div className="w-[85%] px-8 mb-8 mt-auto">
        
        {/* Welcome Block */}
        <div className="mb-6">
           <h2 className="text-3xl font-bold text-white/90 mb-2 leading-tight">
             Create. <br/>
             <span className="text-pink-500">Connect.</span> <br/>
             Inspire.
           </h2>
        </div>

        {/* --- NEW SEARCH BAR --- */}
        <div className="mb-6 relative">
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={postSearch}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-pink-500 transition"
            />
            <Search className="absolute left-3 top-3.5 text-white/40" size={18} />
            {postSearch && (
                <X 
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 text-white/40 hover:text-white cursor-pointer" 
                  size={18} 
                />
            )}
        </div>

        {/* Explore / Trending Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-white/80">
             <Compass size={18} className="text-pink-400" />
             <span className="font-semibold text-sm tracking-wide uppercase">Explore Topics</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag, i) => (
              <span 
                key={i}
                // Updated onClick
                onClick={() => handleTagClick(tag)}
                className="text-xs font-medium text-pink-200 bg-purple-900/50 px-3 py-1.5 rounded-full border border-white/5 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all cursor-pointer select-none flex items-center gap-1"
              >
                <Sparkles size={10} /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-between text-white/20 text-[10px] font-medium tracking-wider uppercase">
           <span>© 2026 Timelium</span>
           <span>v1.0.0</span>
        </div>
      </div>

      <LoginSignUpCard open={openLogin} onClose={() => setOpenLogin(false)} />
      
      <CreatePostDialog 
        open={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
        onPostCreated={() => {
            if (location.pathname === "/") {
             window.location.reload();
            }
        }}
      />
      
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
      )}
    </div>
  );
};

export default Split0;