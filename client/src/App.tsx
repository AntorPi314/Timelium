import React from "react";
import { Toaster } from "react-hot-toast";
import Split0 from "./home/Split0";
import Split1 from "./home/Split1";
import Split2 from "./home/Split2";

const App = () => {
  return (
    <>
      <div className="h-screen w-screen flex bg-[#ffffff]">
        <Split0 />
        <Split1 />
        <Split2 />
      </div>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
