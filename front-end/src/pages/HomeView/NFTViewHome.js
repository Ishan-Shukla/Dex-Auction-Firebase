import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFTsView = () => {
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [NFT, setNFT] = useState();

  const { id } = useParams();

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(asset, ASSET.abi, Provider);
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
