import { useState, useEffect } from "react";
import { Home, User, PlusCircle, LogOut, UserCircle } from "lucide-react";
import LoginSignUpCard from "../components/ui/LoginSignUpCard";
import CreatePostDialog from "../components/ui/CreatePostDialog";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Split0 = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage on mount & on update
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
    
    //  Listen for both 'storage' (multi-tab) and custom 'user-update' (same-tab)
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

  return (
    <div className="w-[30%] h-full bg-[#381B5E] relative">

      <div className="w-[85%] h-15 mt-8 px-8 flex items-center bg-gradient-to-r from-purple-700 via-purple-700 to-purple-900 rounded-tr-[30px] rounded-br-[30px] shadow-lg">
        
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
            //  Logged In State
            <div className="relative">
              <img 
                src={user.avatar || "https://i.imgur.com/6VBx3io.jpeg"} 
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/50 cursor-pointer object-cover hover:border-pink-500 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {/* Dropdown Menu */}
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
            // Logged Out State
            <User
              onClick={() => setOpenLogin(true)}
              className="w-8 h-auto text-white cursor-pointer hover:text-pink-500 transition"
            />
          )}
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