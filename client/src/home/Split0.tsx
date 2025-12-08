import React, { useState } from "react";
import { Home, User } from "lucide-react";
import LoginSignUpCard from "../components/ui/LoginSignUpCard";

const Split0 = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[30%] h-full bg-[#381B5E]">

      <div className="w-[85%] h-15 mt-8 px-8 flex items-center bg-gradient-to-r from-purple-700 via-purple-700 to-purple-900 rounded-tr-[30px] rounded-br-[30px] shadow-lg">
        
        <p className="text-5xl text-fuchsia-600 font-medium">T</p>

        <div className="w-full flex justify-end">
          <Home className="w-8 h-auto text-white mr-4" />
          <User
            onClick={() => setOpen(true)}
            className="w-8 h-auto text-white cursor-pointer"
          />
        </div>
      </div>

      <LoginSignUpCard open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Split0;
