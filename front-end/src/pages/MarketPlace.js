import React, { useContext, useState, useEffect } from "react";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { useParams, useHistory } from "react-router";
import { MetamaskProvider } from "../App";
import { ethers } from "ethers";
import OnAuctionViewCard from "../Components/Card/OnAuctionViewCard";
import NFTViewMarketPlace from "./Market/NFTViewMarketPlace";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFT = React.createContext();

const MarketPlace = () => {
  const [onAuctions, setAuctions] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const signer = await provider.getSigner();
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const data = await contract.getAllAuctions();
    console.log(data);
    contract = new ethers.Contract(asset, ASSET.abi, signer);
    const auctions = await Promise.all(
      data
        .filter((nft) => nft.tokenId.toNumber() !== 0)
        .slice()
        .sort((a, b) =>
          a.tokenId.toNumber() > b.tokenId.toNumber()
            ? 1
            : b.tokenId.toNumber() > a.tokenId.toNumber()
            ? -1
            : 0
        )
        .map(async (NFT) => {
          const tokenURI = await contract.tokenURI(NFT.tokenId);
          let asset = {
            tokenId: NFT.tokenId.toNumber(),
            seller: NFT.seller.toString(),
            reservePrice: NFT.startingPrice.toString(),
            maxBidPrice: NFT.maxBidPrice.toNumber(),
            maxBidder: NFT.maxBidder.toString(),
            duration: NFT.duration.toNumber(),
            startAt: NFT.startAt.toNumber(),
            status: NFT.auctionStatus.toString(),
            tokenURI,
          };
          return asset;
        })
    );
    console.log(auctions);
    setAuctions(auctions);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded")
    return (
      <Router>
        <Route exact path="/Market">
          <div className="flex pt-32 justify-center">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {onAuctions.map((nft) => (
                  <div
                    key={nft.tokenId}
                    className="border shadow rounded-xl overflow-hidden"
                  >
                    <Link to={`/Market/Auction/${nft.tokenId}`} replace>
                      <OnAuctionViewCard
                        // tokenId={nft.tokenId}
                        // seller={nft.seller}
                        reservePrice={nft.reservePrice}
                        // maxBidPrice={nft.maxBidPrice}
                        // maxBidder={nft.maxBidder}
                        // duration={nft.duration}
                        // startAt={nft.startAt}
                        // status={nft.status}
                        // tokenURI={nft.tokenURI}
                        // index={nft.index}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Market/Auction/:id">
          <NFTViewMarketPlace />
        </Route>
      </Router>
    );
  return <h1>Loading</h1>;
};

export default MarketPlace;
