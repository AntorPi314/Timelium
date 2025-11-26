import { useState } from 'react';

function App() {
  return (
    <div className="w-screen h-screen bg-[#1A0B2E] overflow-hidden font-sans select-none">
      
      <div className="absolute left-0 top-14 w-[280px] z-20">
        <div className="ml-[-30px] bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 rounded-r-[50px] shadow-[0_10px_40px_-10px_rgba(168,85,247,0.6)] h-24 flex items-center w-full">
          <div className="ml-[60px] text-fuchsia-400 text-7xl font-serif italic font-medium drop-shadow-lg">T</div>
        </div>
      </div>

      <div className="absolute left-[280px] top-0 w-[calc(100vw-870px)] h-screen border-r border-white/5 bg-[#1A0B2E]">
        <div className="h-20 w-full flex items-end justify-center gap-24 border-b border-white/10 pb-0">
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="text-white text-xl font-bold mb-3 tracking-wide">For you</div>
            <div className="w-16 h-1 bg-violet-500 rounded-t-full shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
          </div>
          <div className="flex flex-col items-center cursor-pointer mb-4">
            <div className="text-white/60 text-xl font-bold hover:text-white/90 transition-colors tracking-wide">Following</div>
          </div>
        </div>

        <div className="p-6">
        </div>
      </div>

      <div className="absolute right-0 top-0 w-[590px] h-screen p-10 bg-[#1A0B2E]">
        <div className="text-stone-300 text-2xl font-medium mb-8 tracking-wide">
          Who's <span className="text-rose-500 font-semibold">trending</span> near you
        </div>

        <div className="absolute bottom-12 right-12 w-[480px] h-[350px] bg-white rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden">
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-violet-700 text-3xl font-semibold tracking-tight">
              Hello, Antor
            </div>
          </div>

          <div className="p-6">
            <div className="w-full h-16 p-[2px] rounded-[20px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
              <div className="w-full h-full bg-slate-50 rounded-[18px] flex items-center px-5">
                <input 
                  type="text"
                  placeholder="Ask Timelium AI..."
                  className="w-full bg-transparent text-stone-500 text-lg outline-none placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;