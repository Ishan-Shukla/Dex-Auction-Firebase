import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import ViewCard from "../../Components/Card/ViewCard";
import { GoBack } from "../../Components/Buttons/GoBack";
import { NFTassetView } from "./NFTassetView";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
// const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFT = React.createContext();

export const AssetView = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  const changeStatus = () => {
    props.status("not-loaded");
  };

  async function loadNFTs() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getOwnerAssets();
    // console.log(data[0].TokenID.toNumber());
    const finalData = data
      .slice()
      .sort((a, b) =>
        a.TokenID.toNumber() > b.TokenID.toNumber()
          ? 1
          : b.TokenID.toNumber() > a.TokenID.toNumber()
          ? -1
          : 0
      );
    let counter = 0;
    // if (data.length > 0) {
    let assets = await Promise.all(
      finalData.map(async (NFT) => {
        // console.log(NFT.TokenID);
        const tokenURI = await contract.tokenURI(NFT.TokenID);
        let asset = {
          tokenId: NFT.TokenID.toNumber(),
          owner: NFT.owner.toString(),
          tokenURI,
          index: counter++,
        };
        return asset;
      })
    );
    // console.log(assets);
    setNFTs(assets);
    // }
    setLoadingState("loaded");
  }
  if (loadingState === "loaded") {
    return (
      <Router>
        <Switch>
          <Route exact path="/MyAssets/AssetView">
            <div className="flex pt-32 justify-center">
              <GoBack change={changeStatus} url="/MyAssets"/>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {NFTs.map((nft) => (
                    <div
                      key={nft.tokenId}
                      className="border shadow rounded-xl overflow-hidden"
                    >
                      <Link
                        to={`/MyAssets/Asset/${nft.tokenId}/${nft.index}`}
                        
                      >
                        <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Route>
          <NFT.Provider value={NFTs}>
            <Route path="/MyAssets/Asset/:id/:index">
              <NFTassetView status={changeStatus} viewState={()=>setLoadingState("not-loaded")} />
            </Route>
          </NFT.Provider>
        </Switch>
      </Router>
    );
  }
  return <h1>Loading</h1>;
};
