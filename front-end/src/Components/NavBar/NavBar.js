import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [status, setStatus] = useState(0);
  const [isShowing, setIsShowing] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/MyAssets")) {
      console.log("This is Path");
    } else if (path.includes("/Market")) {
      console.log("This is Market");
    } else if (path.includes("/NFT")) {
      console.log("This is NFT");
    }
  }, [location]);
  console.log(location.pathname);
  return (
    <div className="h-26 fixed z-50 text-xl font-sans top-1/2 transform -rotate-90 -right-44 rounded-t-3xl pl-4 pr-4 pb-10 bg-blue-200 bg-opacity-10 border-t-8 border-l-2 border-r-2 border-gray-300 backdrop-filter backdrop-blur-md backdrop-brightness-70 transition duration-200 ease-in-out hover:-translate-x-10">
      <div>
        <div className="mt-2 mb-2 ml-6 mr-6 bg-gray-300 pt-1 rounded-full"></div>
        <div className="flex flex-row mt-5">
          <div>
            <Link to="/MyAssets" className="p-4">
              My Assets
            </Link>
          </div>
          <div>
            <Link to="/Market" className="p-4">
              MarketPlace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
