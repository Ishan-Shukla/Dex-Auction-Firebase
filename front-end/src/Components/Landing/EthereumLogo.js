import React from "react";
import ethPlaceholder from "../../img/Ethereum.png";

function EthereumLogo() {
  return (
    <div className="flex-1 flex items-center">
      <div className="p-32">
        <img
          src={ethPlaceholder}
          alt="Logo"
        />
      </div>
    </div>
  );
}

export default EthereumLogo;
