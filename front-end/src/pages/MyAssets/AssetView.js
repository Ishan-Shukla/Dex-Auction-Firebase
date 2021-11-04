import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import ViewCard from "../../Components/Card/ViewCard";
import { GoBack } from "../../Components/Buttons/GoBack";
import { NFTassetView } from "./NFTassetView";
import axios from "axios";
import loading from "../../img/Loading.svg";
import UseTitle from "../../Components/Title/UseTitle";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFT = React.createContext();

export const AssetView = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

  // Set Title
  UseTitle("AssetView");
  
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
    const finalData = data
      .slice()
      .sort((a, b) =>
        a.tokenId.toNumber() > b.tokenId.toNumber()
          ? 1
          : b.tokenId.toNumber() > a.tokenId.toNumber()
          ? -1
          : 0
      );
    let counter = 0;
    let assets = await Promise.all(
      finalData.map(async (NFT) => {
        const tokenURI = await contract.tokenURI(NFT.tokenId);
        const meta = await axios.get(tokenURI);

        let asset = {
          tokenId: NFT.tokenId.toNumber(),
          owner: NFT.owner.toString(),
          image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
          name: meta.data.name,
          description: meta.data.description,
          index: counter++,
        };
        return asset;
      })
    );
    setNFTs(assets);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded") {
    return (
      <Router>
        <Switch>
          <Route exact path="/MyAssets/AssetView">
            <div className="flex pt-32 justify-center">
              <GoBack change={changeStatus} url="/MyAssets" />
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                  {NFTs.map((nft) => (
                    <div key={nft.tokenId}>
                      <Link to={`/MyAssets/Asset/${nft.tokenId}/${nft.index}`}>
                        <ViewCard
                          tokenId={nft.tokenId}
                          name={nft.name}
                          image={nft.image}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Route>
          <NFT.Provider value={NFTs}>
            <Route path="/MyAssets/Asset/:id/:index">
              <NFTassetView
                status={changeStatus}
                viewState={() => setLoadingState("not-loaded")}
              />
            </Route>
          </NFT.Provider>
        </Switch>
      </Router>
    );
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <img src={loading} alt="Loading" className="h-20" />
    </div>
  );
};
