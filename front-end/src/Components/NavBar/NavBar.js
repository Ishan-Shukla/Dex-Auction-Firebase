import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed flex z-50 text-xl top-1/2 transform -rotate-90 -right-24">
      <Link to="/MyAssets" className="flex-grow p-4">My Assets</Link>
      <Link to="/Market" className="flex-grow p-4">MarketPlace</Link>
    </div>
  );
}