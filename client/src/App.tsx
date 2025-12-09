import React from "react";
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
            <div className="h-screen w-screen flex bg-[#ffffff]">
              <Split0 />
              <Split1 />
              <Split2 />
            </div>
          }
        />


        <Route path="/antor" element={<Profile />} />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
};

export default App;
