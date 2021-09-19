import React, { useContext, useEffect, useState } from "react";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import { ethers } from "ethers";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTViewMarketPlace = () => {
  const [onAuction, setAuction] = useState();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [priceInput, updatePriceInput] = useState({
    price: ""
  });
  const history = useHistory();
  const provider = useContext(MetamaskProvider);
  const { id } = useParams();

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const signer = await provider.getSigner();
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const data = await contract.getAuction(id);
    console.log(data);
    contract = new ethers.Contract(asset, ASSET.abi, signer);
    const URI = await contract.tokenURI(id);
    const auc = {
      tokenId: data.tokenId.toNumber(),
      seller: data.seller.toString(),
      reservePrice: data.startingPrice.toString(),
      maxBidPrice: data.maxBidPrice.toNumber(),
      maxBidder: data.maxBidder.toString(),
      duration: data.duration.toNumber(),
      startAt: data.startAt.toNumber(),
      status: data.auctionStatus.toString(),
      URI,
    };
    console.log(auc);
    setAuction(auc);
    setLoadingState("loaded");
  };

  async function placeBid(){
    const { price } = priceInput;
    if (!price) {
      return
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const amount = ethers.utils.parseUnits(price, 'ether')  
    const transaction = await contract.BidAuction( id,{
      value: amount
    })
    await transaction.wait();
    await history.push("/");
  }

  if (loadingState === "loaded")
    return (
      <Router>
        <GoBack />
        <div className="flex p-40 max-h-screen justify-center">
          <div className="w-full border h-max p-4">
            <p>Pic Here</p>
          </div>
          <div className="p-4 w-full flex-grow border">
            <div>Token ID- {onAuction.tokenId}</div>
            <div>Seller- {onAuction.seller}</div>
            <div>Reserve Price- {onAuction.reservePrice}</div>
            <div>maxBidPrice- {onAuction.maxBidPrice}</div>
            <div>maxBidder- {onAuction.maxBidder}</div>
            <div>Duration- {onAuction.duration}</div>
            <div>Start At- {onAuction.startAt}</div>
            <div>Status- {onAuction.status}</div>
            <div>tokenURI- {onAuction.tokenURI}</div>
          </div>
          <div>
            <input
              placeholder="Price"
              className="mt-8 border rounded p-4"
              onChange={(e) =>
                updatePriceInput({ ...priceInput, price: e.target.value })
              }
            />
            <button onClick={placeBid}>Place Bid</button>
          </div>
        </div>
      </Router>
    );
  return <h1>Loading</h1>;
};

export default NFTViewMarketPlace;
