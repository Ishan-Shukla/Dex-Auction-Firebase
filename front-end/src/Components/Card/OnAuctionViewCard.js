import { formatEther } from "@ethersproject/units";
import React from "react";

export const OnAuctionViewCard = (props) => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg ml-auto mr-auto h-96 w-64 shadow-lg transform transition duration-500 hover:scale-110">
      <div className="h-4/5">
        <div className="absolute -top-5">
          <img src={props.image} alt="PlaceHolder"></img>
        </div>
      </div>
      <div className="z-20 h-2/6 bg-white">
        <div className="flex flex-col h-full w-full justify-evenly">
          <div className="pl-2">{props.name}</div>
          <div className="pl-2">Reserve Price-{formatEther(props.reservePrice)} ETH</div>
        </div>
      </div>
    </div>
  );
};
export default OnAuctionViewCard;
