import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Split0 from "./home/Split0";
import Split1 from "./home/Split1";
import Split2 from "./home/Split2";
import Profile from "./profile/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen w-screen flex flex-col lg:flex-row bg-[#ffffff] overflow-hidden">
              {/* Mobile Navigation Header - visible only on mobile/tablet */}
              <div className="lg:hidden w-full bg-[#381B5E] px-4 py-3 flex items-center justify-between shrink-0">
                <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600">
                  T
                </p>
                <div className="flex items-center gap-3">
                  <Split0 isMobile={true} />
                </div>
              </div>
              
              {/* Desktop Sidebar - hidden on mobile */}
              <div className="hidden lg:block lg:w-[30%]">
                <Split0 />
              </div>
              
              {/* Main Feed - full width on mobile, 43% on desktop */}
              <Split1 />
              
              {/* Right Sidebar - hidden on mobile/tablet, visible on desktop */}
              <div className="hidden lg:block lg:w-[32%]">
                <Split2 />
              </div>
            </div>
          }
        />
        {/* Dynamic Username Route (Public) */}
        <Route path="/:username" element={<Profile />} />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
};

export default App;