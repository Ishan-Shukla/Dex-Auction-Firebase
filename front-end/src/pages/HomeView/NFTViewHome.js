import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import TopBar from "../../Components/Header/TopBar";
import axios from "axios";

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
    const tokenURI = await contract.tokenURI(id); // NFT ipfs URI
    console.log(tokenURI);
    const meta = await axios.get(tokenURI);
    console.log(meta);
    // Organized data
    const nft = {
      tokenId: data.tokenId.toNumber(),
      owner: data.owner,
      image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
      name: meta.data.name,
      description: meta.data.description,
    };
    console.log("---NFT View (Home)---");
    console.log("Viewing NFT (TokenId): " + nft.tokenId);

    setNFT(nft);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded")
    return (
      <div>
        <TopBar /> {/* Top Frosted Glass bar with DexAuction Logo */}
        <GoBack url="/" />
        <div className="flex pt-36 pl-32 pr-32 pb-14 h-screen justify-center">
          <div className="w-full flex justify-center p-4 border-r-2">
            <img src={NFTs.image} alt="NFTimage" className=""></img>
          </div>
          <div className="p-4 w-full cursor-default">
            <div className="flex w-full h-full flex-col font-semibold">
              <div className="flex border-b-2">
                <div className="text-5xl font-Hanseif pb-1">
                  #{NFTs.tokenId}
                </div>
                <div className="text-4xl font-Hanseif p-1 place-self-end ml-4">
                  {NFTs.name}
                </div>
              </div>
              <div className="p-2">"{NFTs.description}"</div>
              <div className="p-2">
                <div>Owner</div>
                <div className="pl-4">{NFTs.owner}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return <h1>Loading</h1>;
};
