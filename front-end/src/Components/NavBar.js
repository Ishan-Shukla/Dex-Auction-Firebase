import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed flex text-xl top-1/2 transform -rotate-90 -right-24">
      <Link className="flex-grow p-4">My Assets</Link>
      <Link className="flex-grow p-4">MarketPlace</Link>
    </div>
  );
}