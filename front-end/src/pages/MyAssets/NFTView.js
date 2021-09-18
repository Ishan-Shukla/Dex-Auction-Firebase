import React, { createContext, useContext, useState } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { NFT } from "./AssetView";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
// import ViewCard from "../../Components/Card/ViewCard";
// import { Link } from "react-router-dom";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTView = (props) => {
  const history = useHistory();

  const nfts = useContext(NFT);

  const { id, index } = useParams();

  const provider = useContext(MetamaskProvider);

  const [auctionInput, updateAuctionInput] = useState({
    price: "",
    duration: "",
  });

  const changeStatus = () => {
    props.status("not-loaded");
  };

  async function BurnAsset() {
    // console.log(provider);
    // console.log(nfts);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Burn(id);
    let tx = await transaction.wait();
    // console.log(tx);
    await changeStatus();
    await history.push("/MyAssets");
  }

  async function approveAsset(tokenId) {
    const signer = provider.getSigner();

    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Approve(tokenId);
    let tx = await transaction.wait();
    // console.log(tx);
  }

  async function createAuction(tokenId, price, duration) {
    const signer = provider.getSigner();
    // console.log(parseInt(duration));
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CreateAuction(
      tokenId,
      ethers.utils.parseEther(price),
      parseInt(duration)
    );
    let tx = await transaction.wait();
  }

  async function approveAndCreate() {
    const { price, duration } = auctionInput;
    if (!price || !duration) {
      return;
    }

    await approveAsset(nfts[index].tokenId);
    await createAuction(nfts[index].tokenId, price, duration);
    await changeStatus();
    await history.push("/MyAssets");
  }

  return (
    <Router>
      <GoBack />
      <Route exact path={`/MyAssets/Asset/${id}/${index}`}>
        <div className="flex p-40 max-h-screen justify-center">
          <div className="w-full border h-max p-4">
            <p>Pic Here</p>
          </div>
          <div className="p-4 w-full flex-grow border">
            <div>Asset Id- {nfts[index].tokenId}</div>
            <div>
              <button
                onClick={BurnAsset}
                className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
              >
                Burn Asset
              </button>
              <Link to={`/MyAssets/Asset/Create/${id}/${index}`} replace>
                <button className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
                  Create Auction
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/MyAssets/Asset/Create/:id/:index">
        <div className="min-w-full">
          <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
            <input
              placeholder="Auction Price"
              className="mt-8 border rounded p-4"
              onChange={(e) =>
                updateAuctionInput({ ...auctionInput, price: e.target.value })
              }
            />
            <textarea
              placeholder="Auction Duration"
              className="mt-2 border rounded p-4 resize-none h-52 overflow-y-auto"
              onChange={(e) =>
                updateAuctionInput({
                  ...auctionInput,
                  duration: e.target.value,
                })
              }
            />
            <button onClick={approveAndCreate} className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
              Create Auction
            </button>
          </div>
        </div>
      </Route>
    </Router>
  );
};
