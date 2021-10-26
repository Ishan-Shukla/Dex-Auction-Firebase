import React, { useContext, useEffect, useState } from "react";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
import { ethers } from "ethers";
import { useParams, useHistory } from "react-router";
import placeHolder from "../../img/PlaceHolder.svg";
import { formatEther } from "@ethersproject/units";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTViewMarketPlace = (props) => {
  const [NFTonAuction, setAuction] = useState();
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

  const isSeller = (seller) => {
    const address = ethers.utils.getAddress(Account.toString());
    return seller.localeCompare(address) === 0;
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
      reservePrice: formatEther(data.startingPrice.toString()),
      maxBidPrice: formatEther(data.maxBidPrice.toString()),
      maxBidder: data.maxBidder.toString(),
      duration: data.duration.toNumber(),
      startAt: data.startAt.toNumber(),
      status: data.auctionStatus.toString(),
      tokenURI: URI,
    };
    const address = ethers.utils.getAddress(Account.toString());
    if (isSeller(auc.seller)) {
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
      <div>
        <GoBack change={changeState} url="/Market" />
        <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
          <div className="w-full flex justify-center h-max p-4 border-r-2">
            <img src={placeHolder} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full cursor-default">
            <div className="flex w-full h-full flex-col font-semibold">
              <div className="flex border-b-2">
                <div className="text-5xl font-Hanseif pb-1 flex-1">
                  #{NFTonAuction.tokenId}
                </div>
              </div>
              <div className="p-2">
                <div>Owner</div>
                <div className="pl-4">{NFTonAuction.seller}</div>
              </div>
              <div className="p-2">
                Asset description
              </div>
              {!isSeller(NFTonAuction.seller) ? (
                <div className="p-2">
                  Seller- {NFTonAuction.seller}
                </div>
              ) : null}
              {NFTonAuction.startAt === 0 ? (
                <div className="p-2">
                  Reserve Price- {NFTonAuction.reservePrice} ETH
                </div>
              ) : (
                <>
                  <div className="p-2">
                    maxBidder- {NFTonAuction.maxBidder}
                  </div>
                  <div className="p-2">
                    Current Price- {NFTonAuction.maxBidPrice} ETH
                  </div>
                  <div className="p-2">
                    Duration- Left Timer will be here
                  </div>
                </>
              )}
              <div className="mt-auto">
                {lock ? null : (
                  <div className="flex">
                    <input
                      placeholder="Price"
                      className="mt-2 border rounded p-4"
                      onChange={(e) =>
                        updatePriceInput({
                          ...priceInput,
                          price: e.target.value,
                        })
                      }
                    />

                    <button
                      className="flex items-center justify-center p-4 m-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
                      onClick={placeBid}
                    >
                      Place Bid
                    </button>
                  </div>
                )}
                {claim ? <button onClick={claimNFT}>Claim NFT</button> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return <h1>Loading</h1>;
};

export default NFTViewMarketPlace;
