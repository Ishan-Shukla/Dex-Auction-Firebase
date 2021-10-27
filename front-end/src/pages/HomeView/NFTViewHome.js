import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import placeHolder from "../../img/PlaceHolder.svg";
import TopBar from "../../Components/Header/TopBar";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFTViewHome = () => {
  const [loadingState, setLoadingState] = useState("not-loaded"); // Loading state for main return
  const [NFTs, setNFT] = useState(); // Fetched NFTs details

  const { id } = useParams(); // TokenId of NFT received from URL

  // useEffect + loadingState
  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  // Fetch NFTs from the blockchain
  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider(); // JsonRpcProvider
    const contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const data = await contract.getAsset(id); // Fetched data
    const URI = await contract.tokenURI(id); // NFT ipfs URI

    // Organized data
    const nft = {
      tokenId: data.tokenId.toNumber(),
      owner: data.owner,
      URI,
    };

    console.log("NFT View of TokenId: " + nft.tokenId);

    setNFT(nft);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded")
    return (
      <div>
        <TopBar /> {/* Top Frosted Glass bar with DexAuction Logo */}
        <GoBack url="/" />
        <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
          <div className="w-full flex justify-center h-max p-4 border-r-2">
            <img src={placeHolder} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full cursor-default">
            <div className="flex w-full h-full flex-col font-semibold">
              <div className="flex border-b-2">
                <div className="text-5xl font-Hanseif pb-1 flex-1">
                  #{NFTs.tokenId}
                </div>
              </div>
              <div className="p-2 mt-4 text-3xl font-Hanseif">Asset Name</div>
              <div className="p-2">
                <div>Owner</div>
                <div className="pl-4">{NFTs.owner}</div>
              </div>
              <div className="p-2">Asset description</div>
            </div>
          </div>
        </div>
      </div>
    );
  return <h1>Loading</h1>;
};
