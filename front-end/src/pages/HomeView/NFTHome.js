import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { NFT } from "./AssetView";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
import { NFTsView } from "./NFTViewHome";
import ViewCard from "../../Components/Card/ViewCard";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFT = React.createContext();

export const NFTHome = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getAllAssets();
    const blackHole = "0x0000000000000000000000000000000000000000";
    // console.log(data);
    let counter = 0;
    // const assets = data.filter(nft => nft.TokenID.toNumber() !== 0).filter((nft) => blackHole.localeCompare(nft.owner.toString()) !== 0);
    // console.log(finalData);
    let assets = await Promise.all(
      data
        .filter((nft) => nft.TokenID.toNumber() !== 0)
        .filter((nft) => blackHole.localeCompare(nft.owner.toString()) !== 0)
        .map(async (NFT) => {
          // console.log(NFT.TokenID);
          const tokenURI = await contract.tokenURI(NFT.TokenID);
          let asset = {
            tokenId: NFT.TokenID.toNumber(),
            owner: NFT.owner,
            tokenURI,
            index: counter++,
          };
          return asset;
        })
    );
    console.log(assets);
    setNFTs(assets);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && NFTs.length) {
    return (
      // <Router>
      //   <Switch>
      //     <Route exact path="/">
            <div className="flex justify-center">
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {NFTs.map((nft) => (
                    <div
                      key={nft.tokenId}
                      className="border shadow rounded-xl overflow-hidden"
                    >
                      <Link to={`/NFT/${nft.tokenId}`}>
                        <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
                      </Link>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
      //     </Route>
      //   </Switch>
      // </Router>
    );
  }
  return <h1>Loading</h1>;
};

//   if (loadingState === "loaded"  && !NFTs.length) {
//     return (
//       <Router>
//         <Switch>
//           <Route exact path="/MyAssets/AssetView">
// <div className="flex pt-32 justify-center">
//   <div className="p-4">
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
//       {NFTs.map((nft) => (
//         <div
//           key={nft.tokenId}
//           className="border shadow rounded-xl overflow-hidden"
//         >
//           <Link
//             to={`/MyAssets/Asset/${nft.tokenId}/${nft.index}`}
//             replace
//           >
//             <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
//           </Link>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>
//           </Route>
//           <NFT.Provider value={NFTs}>
//             <Route path="/MyAssets/Asset/:id/:index">
//             </Route>
//           </NFT.Provider>
//         </Switch>
//       </Router>
//     );
//   }
//   return <h1>Loading</h1>;
// };
