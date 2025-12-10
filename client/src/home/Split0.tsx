import React, { useState, useEffect } from "react";
import { Home, User, PlusCircle, LogOut, UserCircle } from "lucide-react";
import LoginSignUpCard from "../components/ui/LoginSignUpCard";
import { useNavigate } from "react-router-dom";

const Split0 = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    checkUser();
    
    // Listen for storage changes (optional, useful if multiple tabs)
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [open]); // Re-check when modal closes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/"); // Redirect to home
  };

  const handleProfileClick = () => {
    if (user?.username) {
      navigate(`/${user.username}`);
    }
    setShowDropdown(false);
  };

  return (
    <div className="w-[30%] h-full bg-[#381B5E] relative">

      <div className="w-[85%] h-15 mt-8 px-8 flex items-center bg-gradient-to-r from-purple-700 via-purple-700 to-purple-900 rounded-tr-[30px] rounded-br-[30px] shadow-lg">
        
        <p className="text-5xl text-fuchsia-600 font-medium cursor-pointer" onClick={() => navigate('/')}>T</p>

        <div className="w-full flex justify-end items-center relative">
          <PlusCircle className="w-8 h-auto text-white mr-4 cursor-pointer hover:text-pink-500 transition" />
          <Home className="w-8 h-auto text-white mr-4 cursor-pointer hover:text-pink-500 transition" onClick={() => navigate('/')} />
          
          {user ? (
            //  Logged In State
            <div className="relative">
              <img 
                src="https://i.imgur.com/6VBx3io.jpeg" // Placeholder Avatar (Backend থেকে image আসলে সেটা বসাবেন)
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/50 cursor-pointer object-cover hover:border-pink-500 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {/* ✅ Dropdown Menu */}
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
              onClick={() => setOpen(true)}
              className="w-8 h-auto text-white cursor-pointer hover:text-pink-500 transition"
            />
          )}
        </div>
      </div>

      <LoginSignUpCard open={open} onClose={() => setOpen(false)} />
      
      {/* Click outside listener to close dropdown can be added here if needed */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
      )}
    </div>
  );
};

export default Split0;