import React, { useContext } from "react";
import ViewCard from "../../Components/Card/ViewCard";
import { Link } from "react-router-dom";
import { NFT } from "../MyAssets";
import { UserAccount } from "../../App";
import Address from "../../Components/Header/Address";
import { MintButton } from "../../Components/Buttons/MintButton";

function View() {
  const nfts = useContext(NFT);
  const Account = useContext(UserAccount);

  //   console.log(nfts);
  return (
    <>
      <Address address={Account} />
      <MintButton/>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft) => (
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
      </div>
    </>
  );
}

export default View;
