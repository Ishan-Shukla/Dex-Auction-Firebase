import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import { NFT } from "./AssetView";
import ViewCard from "../../Components/Card/ViewCard";
import { Link } from "react-router-dom";
import { GoBack } from "../../Components/Buttons/GoBack";

export const NFTView = (props) => {
  const nfts = useContext(NFT);
  const { id } = useParams();
  const history = useHistory();
  const ID = id - 1;
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
