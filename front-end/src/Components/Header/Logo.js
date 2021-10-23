import React, { useEffect, useState } from "react";
import logo from "../../img/Logo.svg";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

function Logo() {
  const history = useHistory();
  const location = useLocation();

  const work = () => {
    const path = location.pathname;
    let status = 0;
    const changeStatus = (to) => {
      status = to;
      return true;
    };
    if (
      (path.includes("/MyAssets") && changeStatus(1)) ||
      (path.includes("/Market") && changeStatus(2))
    ) {
      const pushLocation = {
        pathname: "/",
        state: {
          fromAsset: status === 1 ? true : false,
          fromMarket: status === 2 ? true : false,
        },
      };
      history.push(pushLocation);
    }
  };

  return (
    <div className="flex z-50 flex-row" onClick={work}>
      <div>
        <img
          className="ml-6 z-50 h-10 w-auto mix-blend-overlay sm:h-10"
          src={logo}
          alt="Logo"
        />
      </div>
      <div className="ml-4">
        <p className=" leading-none pt-3 font-Hanseif">
          DeX- <br />
          Auction{" "}
        </p>
      </div>
    </div>
  );
}

export default Logo;
