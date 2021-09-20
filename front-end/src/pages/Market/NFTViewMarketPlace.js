import React, { useContext, useEffect, useState } from "react";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
import { ethers } from "ethers";
import { useParams, useHistory } from "react-router";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTViewMarketPlace = (props) => {
  const [onAuction, setAuction] = useState();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [priceInput, updatePriceInput] = useState({
    price: "",
  });
  const [lock, setLock] = useState(false);
  const [claim, setClaim] = useState(false);

  const history = useHistory();
  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);
  const { id } = useParams();

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  const changeState = () => {
    props.status();
  };

  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider();
    let contract = new ethers.Contract(auction, AUCTION.abi, Provider);
    const data = await contract.getAuction(id);
    contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const URI = await contract.tokenURI(id);
    const auc = {
      tokenId: data.tokenId.toNumber(),
      seller: data.seller.toString(),
      reservePrice: data.startingPrice.toString(),
      maxBidPrice: data.maxBidPrice.toString(),
      maxBidder: data.maxBidder.toString(),
      duration: data.duration.toNumber(),
      startAt: data.startAt.toNumber(),
      status: data.auctionStatus.toString(),
      tokenURI: URI,
    };
    const address = ethers.utils.getAddress(Account.toString());
    if (auc.seller.localeCompare(address) === 0) {
      setLock(true);
    }
    const blockno = await provider.getBlockNumber();
    const block = await provider.getBlock(blockno);
    console.log(block.timestamp);
    if (auc.startAt !== 0) {
      if (auc.startAt + auc.duration < block.timestamp) {
        setClaim(true);
        setLock(true);
      }
    }
    setAuction(auc);
    setLoadingState("loaded");
  }

  async function placeBid() {
    const { price } = priceInput;
    if (!price) {
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const amount = ethers.utils.parseUnits(price, "ether");
    const transaction = await contract.BidAuction(id, {
      value: amount,
    });
    await transaction.wait();
    history.push("/Market");
    changeState();
  }

  async function claimNFT() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const transaction = await contract.Claim(id);
    const tx = await transaction.wait();
    history.push("/Market");
    changeState();
  }

  if (loadingState === "loaded")
    return (
      <>
        <GoBack change={changeState} url="/Market" />
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
          {lock ? null : (
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
          )}
          {claim ? <button onClick={claimNFT}>Claim NFT</button> : null}
        </div>
      </>
    );
  return <h1>Loading</h1>;
};

export default NFTViewMarketPlace;
