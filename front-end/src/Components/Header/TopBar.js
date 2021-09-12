import React from "react";
import Connect from "./Connect";
import Logo from "./Logo";

function TopBar(props) {
  const ConnectMe = () => {
    props.ConnectMe()
  }
  return (
    <div className="flex fixed top-0 z-50 bg-blue-200 bg-opacity-20 backdrop-filter shadow-bar backdrop-blur-md backdrop-brightness-95 min-w-full p-4">
      <div className="flex-none">
        <Logo />
      </div>
      <div className="flex-grow"></div>
      <div className="flex-none">
        <Connect ConnectMe={ConnectMe} />
      </div>
    </div>
  );
}

export default TopBar;

// fixed bg-gray-400 bg-opacity-20 shadow-bar blur-3xl backdrop-blur-lg border border-gray-100 rounded-b-md min-w-full p-4
