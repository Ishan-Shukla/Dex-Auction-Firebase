import React from "react";

export const OnAuctionViewCard = (props) => {
  return (
    <div className="flex flex-col overflow-hidden shadow-lg rounded-lg h-96 h- w-72 mt-8 ml-auto mr-auto cursor-pointer">
      <div className="border h-4/5">
        <p>NFT Display Here!</p>
      </div>
      <div className="border h-1/5">
        {/* TokenId- {props.tokenId} <br /> */}
        {/* Seller-{props.seller} <br /> */}
        Reserve Price-{props.reservePrice} <br />
        {/* maxBidPrice-{props.maxBidPrice} <br /> */}
        {/* maxBidder-{props.maxBidder} <br /> */}
        {/* duration-{props.duration} <br /> */}
        {/* startAt-{props.startAt} <br /> */}
        {/* status-{props.status} <br /> */}
        {/* tokenURI-{props.tokenURI} <br /> */}
        {/* index-{props.index} <br /> */}
      </div>
    </div>
  );
};
export default OnAuctionViewCard;
// function ViewCard(props) {
//   // let history = useHistory();
//   // const change = () => {
//   // history.push(`/MyAssets/Asset/${props.tokenId}`)
//   // }

//   return (
//     <div className="flex flex-col overflow-hidden shadow-lg rounded-lg h-96 h- w-72 mt-8 ml-auto mr-auto cursor-pointer">
//       <div className="border h-4/5">
//         <p>NFT Display Here!</p>
//       </div>
//       <div className="border h-1/5">
//         TokenId- {props.tokenId} <br />
//         Owner-{props.owner} <br />
//       </div>
//     </div>
//   );
// }

// export default ViewCard;
