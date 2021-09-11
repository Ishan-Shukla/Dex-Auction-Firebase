import React from "react";
import Connect from "./Connect";
import Logo from "./Logo";

function TopBar() {
  return (
    <div className="flex sticky min-w-full bg-gray-400 bg-opacity-40 shadow-bar blur-3xl backdrop-blur-lg border border-gray-200 rounded-b-md p-4">
      <div className="flex-none">
        <Logo/>
      </div>
      <div className="flex-grow">
      </div>
      <div className="flex-none">
          <Connect/>
      </div>
    </div>
  );
}

export default TopBar;

// fixed bg-gray-400 bg-opacity-20 shadow-bar blur-3xl backdrop-blur-lg border border-gray-100 rounded-b-md min-w-full p-4