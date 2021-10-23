import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [status, setStatus] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/MyAssets")) {
      console.log("This is MyAssets");
      setStatus(1);
    } else if (path.includes("/Market")) {
      console.log("This is Market");
      setStatus(2);
    } else {
      setStatus(0);
    }
    setLoadingState("loaded");
  }, [location]);

  const changeStatus = () => {
    setLoadingState("not-loaded");
  };

  const home = "-right-44";
  const other = "-right-28";

  return (
    <div className={`h-26 flex flex-col fixed z-50 text-xl text-gray-400  top-1/2 ${status === 0 ? home : other} transform -rotate-90 rounded-t-3xl pl-4 pr-4 pb-10 bg-blue-200 bg-opacity-10 backdrop-filter backdrop-blur-md backdrop-brightness-70 shadow-inner transition duration-200 ease-in-out hover:-translate-x-10`}>
      <div className="mt-2 mb-2 ml-8 mr-8 bg-gray-300 pt-1 rounded-full"></div>
      <div className="flex flex-row mt-2 mb-4">
        {status === 0 || status === 2 ? (
          <div>
            <Link to="/MyAssets" className="p-4">
              My Assets
            </Link>
          </div>
        ) : null}
        {status === 0 || status === 1 ? (
          <div>
            <Link to="/Market" className="p-4">
              MarketPlace
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

