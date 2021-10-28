import React from "react";
import EthereumLogo from "./EthereumLogo";
import Name from "./Name";

function Content() {
  return (
    <div className="min-h-screen flex">
      <Name/>
      <EthereumLogo/>
    </div>
  );
}

export default Content;
