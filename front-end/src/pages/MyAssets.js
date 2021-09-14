import React, { useState, useEffect } from "react";
import Web3Modal, { Provider } from "web3modal";
import { ethers } from "ethers";
import TopBar from "../Components/Header/TopBar";
import Navbar from "../Components/NavBar/NavBar";
import Address from "../Components/Header/Address";

import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import { Link } from "react-router-dom";
import ViewCard from "../Components/Card/ViewCard";
require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

function MyAssets() {
  const [connected, setStatus] = useState(false);
  const [Account, setAccount] = useState();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  let provider;
  const web3modal = new Web3Modal({});
  let web3;

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    if (provider === undefined) {
      web3 = await web3modal.connect();
      provider = new ethers.providers.Web3Provider(web3);
      let selectedAccount = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getOwnerAssets();
    console.log(data.length);
    if (data.length > 0) {
      let assets = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await contract.tokenURI(i.TokenID);
          let asset = {
            tokenId: i.TokenID.toString(),
            owner: i.owner,
            tokenURI,
          };
          return asset;
        })
      );
      console.log(assets);
      setNfts(assets);
    }
    setLoadingState("loaded");
    setStatus(true);

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
      console.log(Account);
    });

    // Subscribe to chainId change
    web3.on("chainChanged", (chainId) => {
      console.log(parseInt(chainId));
      alert("Chain Id Chainged");
    });

    // Subscribe to disconect
    web3.on("disconnect", (err) => {
      console.log(err);
      setStatus(false);
    });
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <>
        <TopBar />
        <Navbar />
        <div className=" border-b-4 border-blue-100 border-opacity-90 shadow-bar border-dotted z-0 bg-cover bg-center min-h-screen">
          <Address address={Account} />
          <div>
            <div className="flex flex-col pt-28 justify-center">
              <p className="text-5xl font-semibold pb-12 self-center">
                Mint Your First Asset
              </p>
              <div className="self-center">
                <Link to="/MyAssets/Mint">
                  <button className="px-6 py-2 mr-4 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
                    Mint
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  return (
    
    <div>
      <TopBar />
      <Navbar />
      <div className="border-b-4 border-blue-100 border-opacity-90 shadow-bar border-dotted z-0 bg-cover bg-center min-h-screen">
        <Address address={Account} />
        <div className="flex justify-center">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {nfts.map((nft) => (
                <div key={nft.tokenId} className="border shadow rounded-xl overflow-hidden">
                  <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAssets;
// {
//   /* <div
//                 key={nft.tokenId}
//                 className="border shadow rounded-xl overflow-hidden"
//               >
//                 <div className="p-4 bg-black">
//                   <p className="text-2xl font-bold text-white">
//                     TokenId- {nft.tokenId} <br />
//                     Owner-{nft.owner} <br />
//                     tokenURI- {nft.tokenURI}{" "}
//                   </p>
//                 </div>
//               </div> */
// }
{/* <Route exact path="/MyAssets/Mint">
            <Mint />
          </Route> */}