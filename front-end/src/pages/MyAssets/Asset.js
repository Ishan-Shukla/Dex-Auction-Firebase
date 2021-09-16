import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import { NFT } from "../MyAssets";
import ViewCard from "../../Components/Card/ViewCard";
import { Link } from "react-router-dom";
import { GoBack } from "../../Components/Buttons/GoBack";

export const Asset = () => {
  const nfts = useContext(NFT);
  const { id } = useParams();
  const history = useHistory();
  const ID = id - 1;
  // console.log(id);
  // console.log(nfts);
  // console.log("Reached");
  return (
    <div>
      <GoBack/>
    <div className="flex p-40 max-h-screen justify-center">
      <div className="w-full border h-max p-4">
        <p>Pic Here</p>
      </div>
      <div className="p-4 w-full flex-grow border">
        <div>Asset Id- {nfts[ID].tokenId}</div>
      </div>
    </div>
    </div>
  );
};
// {nfts[id-1].tokenId}
// {<div className="flex pt-28 justify-center">
//   <div className="p-4">
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
//       {/* {nfts.map((nft) => ( */}
//       <div
//         // key={nfts[].tokenId}
//         className="border shadow rounded-xl overflow-hidden"
//       >
//         {/* <Link to={`/MyAssets/Asset/${nft.tokenId}`} replace> */}
//         <ViewCard tokenId="100" owner={nfts[id - 1].owner} />
//         {/* </Link> */}
//       </div>
//       {/* ))} */}
//     </div>
//   </div>
// </div>;}
