import React, { useState, useEffect, useContext, createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Web3Modal, { Provider } from "web3modal";
import { ethers } from "ethers";
import TopBar from "../Components/Header/TopBar";
import Navbar from "../Components/NavBar/NavBar";
import Address from "../Components/Header/Address";
import { MetamaskProvider } from "../App";
import { UserAccount } from "../App";
import Mint from "./MyAssets/Mint";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import { Link, Redirect } from "react-router-dom";
import ViewCard from "../Components/Card/ViewCard";
import { New } from "../Components/MyAssets/New";
import { Asset } from "./MyAssets/Asset";
import View from "./MyAssets/View";
require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFT = React.createContext();

const MyAssets = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
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
  }

  const setStatus = () => {
    setLoadingState("not-loaded");
  };

  if (loadingState === "loaded" && !nfts.length)
    return (
      <>
        <Address address={Account} />
        <Router forceRefresh={true}>
          <div className="flex flex-col mt-10 my-auto mx-auto items-center">
            <p className="text-5xl font-semibold pb-12 ">
              Mint Your First Asset
            </p>
            <Mint status={setStatus} />
          </div>
        </Router>
      </>
    );
  return (
    <Router>
      {/* <Redirect to="/MyAssets" /> */}
      <div className="items-center">
        <Switch>
          <NFT.Provider value={nfts}>
            <Route exact path="/MyAssets">
              <View />
            </Route>
            <Route path="/MyAssets/Asset/:id">
              <Asset status={setStatus} />
            </Route>
            <Route path="/MyAssets/Mint">
              <Mint status={setStatus} />
            </Route>
          </NFT.Provider>
        </Switch>
      </div>
    </Router>
  );
};

// return (
//   <>
//     <Address address={Account} />
//     <Redirect to="/MyAssets" />
//     <Router>
//       <div>
//         <Switch>
//           <NFT.Provider value={nfts}>
//             <Route exact path="/MyAssets">
//               <View />
//             </Route>
//             <Route path="/Asset/:id">
//               <Asset />
//             </Route>
//           </NFT.Provider>
//         </Switch>
//       </div>
//     </Router>
//   </>
// );

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
// {
//   /* <Route exact path="/MyAssets/Mint">
//             <Mint />
//           </Route> */
// }
