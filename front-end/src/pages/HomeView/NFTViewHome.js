import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFTsView = () => {
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [NFT, setNFT] = useState();

  const provider = useContext(MetamaskProvider);

  const { id } = useParams();

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getAsset(id);
    console.log(data);
    const URI = await contract.tokenURI(id);
    const nft = {
      tokenId: data.TokenID.toNumber(),
      owner: data.owner,
      URI
    };
    console.log(nft);
    setNFT(nft);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded")
    return (
      <div>
        <GoBack url="/"/>
        <div className="flex p-40 max-h-screen justify-center">
          <div className="w-full border h-max p-4">
            <p>Pic Here</p>
          </div>
          <div className="p-4 w-full flex-grow border">
            <div>Asset Id-{NFT.tokenId} </div>
          </div>
        </div>
      </div>
    );
  return <h1>Loading</h1>;
};
