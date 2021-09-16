import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import ViewCard from "../../Components/Card/ViewCard";
import { GoBack } from "../../Components/Buttons/GoBack";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

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

  async function loadNFTs() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getOwnerAssets();
    console.log(data.length);
    // if (data.length > 0) {
    let assets = await Promise.all(
      data.map(async (NFT) => {
        const tokenURI = await contract.tokenURI(NFT.TokenID);
        let asset = {
          tokenId: NFT.TokenID.toString(),
          owner: NFT.owner,
          tokenURI,
        };
        return asset;
      })
    );
    console.log(assets);
    setNFTs(assets);
    // }
    setLoadingState("loaded");
  }
  if (loadingState === "loaded") {
    return (
      <div className="flex pt-32 justify-center">
        <GoBack />
        <NFT.Provider value={NFTs}>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {NFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="border shadow rounded-xl overflow-hidden"
                >
                  <Link to={`/MyAssets/Asset/${nft.tokenId}`}>
                    <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </NFT.Provider>
      </div>
    );
  }
  return <h1>Loading</h1>;
};

// import React, { useContext } from "react";
// import ViewCard from "../../Components/Card/ViewCard";
// import { Link } from "react-router-dom";
// import { NFT } from "../MyAssets";
// import { UserAccount } from "../../App";
// import Address from "../../Components/Header/Address";
// import { MintButton } from "../../Components/Buttons/MintButton";

// function View() {
//   const nfts = useContext(NFT);
//   const Account = useContext(UserAccount);

//   //   console.log(nfts);
//   return (
//     <>
//       <Address address={Account} />
//       <MintButton/>
// <div className="flex justify-center">
//   <div className="p-4">
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
//       {nfts.map((nft) => (
//         <div
//           key={nft.tokenId}
//           className="border shadow rounded-xl overflow-hidden"
//         >
//           <Link to={`/MyAssets/Asset/${nft.tokenId}`}>
//             <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
//           </Link>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>
//     </>
//   );
// }

// export default View;
