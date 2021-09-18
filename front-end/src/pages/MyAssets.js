import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers } from "ethers";
import Address from "../Components/Header/Address";
import { MetamaskProvider } from "../App";
import { UserAccount } from "../App";
import Mint from "./MyAssets/Mint";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import { AssetView } from "./MyAssets/AssetView";
import { MintButton } from "../Components/Buttons/MintButton";
import { AssetButton } from "../Components/Buttons/AssetButton";
import { AuctionButton } from "../Components/Buttons/AuctionButton";
import { AuctionView } from "./MyAssets/AuctionView";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const CHECK = React.createContext();

const MyAssets = () => {
  
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [load, setLoad] = useState(0);

  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);

  useEffect(() => {
    if (loadingState === "not-loaded") {
      console.log("Checking Status");
      checkAsset();
    }
  }, [loadingState]);

  async function checkAsset() {
    console.log(Account.toString());
    const assetContract = new ethers.Contract(asset, ASSET.abi, provider);
    const auctionContract = new ethers.Contract(auction, AUCTION.abi, provider);
    const assetbalance = await assetContract.balanceOf(Account.toString());
    const auctionbalance = await auctionContract.auctionBalance(
      Account.toString()
    );
    console.log("Asset Balance:");
    console.log(assetbalance.toNumber());
    console.log("Auction Balance:");
    console.log(auctionbalance.toNumber());

    // 0 -> no asset and auction owned
    // 1 -> has only asset owned
    // 2 -> has only auction owned
    // 3 -> owns both asset and auction
    let check = 0;

    if (assetbalance.toNumber() > 0) {
      check = 1;
    }
    if (auctionbalance.toNumber() > 0) {
      if (check === 1) {
        check = 3;
      } else {
        check = 2;
      }
    }
    console.log("Check:");
    console.log(check);
    await setLoad(check);
    await setLoadingState("loaded");
  }

  const setStatus = () => {
    setLoadingState("not-loaded");
  };

  if (loadingState === "loaded")
    return (
      <Router>
        <Switch>
          <Route exact path="/MyAssets">
            <Address address={Account} />
            <div className="flex flex-col mt-10 my-auto mx-auto items-center">
              {load === 0 ? (
                <p className="text-5xl font-semibold pb-10 ">
                  Mint Your First Asset
                </p>
              ) : null}
              <MintButton />
              {load === 1 || load === 3 ? <AssetButton /> : null}
              {load === 2 || load === 3 ? <AuctionButton /> : null}
            </div>
          </Route>
          <Route path="/MyAssets/Mint">
            <Mint status={setStatus} />
          </Route>
          <Route path="/MyAssets/AssetView">
              <AssetView status={setStatus} />
          </Route>
          <Route path="/MyAssets/AuctionView">
            <AuctionView status={setStatus} />
          </Route>
        </Switch>
      </Router>
    );

  return <h1>Loading</h1>;
};
export default MyAssets;

//   const [nfts, setNfts] = useState([]);
//   const [loadingState, setLoadingState] = useState("not-loaded");

//   const provider = useContext(MetamaskProvider);
//   const Account = useContext(UserAccount);

//   useEffect(() => {
//     if (loadingState === "not-loaded") {
//       loadNFTs();
//     }
//   }, [loadingState]);

//   async function loadNFTs() {
//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(asset, ASSET.abi, signer);
//     const data = await contract.getOwnerAssets();
//     console.log(data.length);
//     if (data.length > 0) {
//       let assets = await Promise.all(
//         data.map(async (i) => {
//           const tokenURI = await contract.tokenURI(i.TokenID);
//           let asset = {
//             tokenId: i.TokenID.toString(),
//             owner: i.owner,
//             tokenURI,
//           };
//           return asset;
//         })
//       );
//       console.log(assets);
//       setNfts(assets);
//     }
//     setLoadingState("loaded");
//   }

//   const setStatus = () => {
//     setLoadingState("not-loaded");
//   };

//   if (loadingState === "loaded" && !nfts.length)
//     return (
//       <>
//         <Address address={Account} />
//         <Router forceRefresh={true}>
//           <div className="flex flex-col mt-10 my-auto mx-auto items-center">
//             <p className="text-5xl font-semibold pb-12 ">
//               Mint Your First Asset
//             </p>
//             <Mint status={setStatus} />
//           </div>
//         </Router>
//       </>
//     );
//   return (
//     <Router>
//       {/* <Redirect to="/MyAssets" /> */}
//       <div className="items-center">
//         <Switch>
//           <NFT.Provider value={nfts}>
//             <Route exact path="/MyAssets">
//               <View />
//             </Route>
//             <Route path="/MyAssets/Asset/:id">
//               <Asset status={setStatus} />
//             </Route>
//             <Route path="/MyAssets/Mint">
//               <Mint status={setStatus} />
//             </Route>
//           </NFT.Provider>
//         </Switch>
//       </div>
//     </Router>
//   );
