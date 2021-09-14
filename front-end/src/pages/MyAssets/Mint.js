import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import TopBar from "../../Components/Header/TopBar";
import Navbar from "../../Components/NavBar/NavBar";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

function Mint() {
  const [assetInput, updateAssetInput] = useState({
    name: "",
    description: "",
  });
  const [auctionInput, updateAuctionInput] = useState({
    tokenId: "",
    price: "",
    duration: "",
  });
  const [Account, setAccount] = useState();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  let provider;
  const web3modal = new Web3Modal({});
  let web3;

  useEffect(() => {
    Connect();
  }, []);

  async function Connect() {
    web3 = await web3modal.connect();
    provider = new ethers.providers.Web3Provider(web3);
    let selectedAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(selectedAccount);

    setLoadingState("loaded");

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
      console.log(Account);
    });

    // Subscribe to chainId change
    web3.on("chainChanged", (chainId) => {
      console.log(parseInt(chainId));
      alert("Chain Id Chainged");
    });

    // Subscribe to disconect
    web3.on("disconnect", (err) => {
      console.log(err);
    });
  }

  async function loadNFTs() {
    if (provider === undefined) {
      web3 = await web3modal.connect();
      provider = new ethers.providers.Web3Provider(web3);
      let selectedAccount = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);
    }
    const signer = provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getOwnerAssets();
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
    setLoadingState("loaded");
  }

  async function MintAsset(url) {
    console.log(provider);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Mint(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    console.log(event);
    console.log(value);
    console.log(tokenId);
  }

  async function createAsset() {
    const { name, description } = assetInput;
    if (!name || !description) return;
    if (provider === undefined) {
      web3 = await web3modal.connect();
      provider = new ethers.providers.Web3Provider(web3);
      let selectedAccount = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);
    }
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
    });
    console.log(data);
    MintAsset("Test");
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex mt-36 justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <h1>{Account}</h1>
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateAssetInput({ ...assetInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateAssetInput({ ...assetInput, description: e.target.value })
            }
          />
          <button
            onClick={createAsset}
            className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          >
            Create Digital Asset
          </button>
    
        </div>
      </div>
    </>
  );
}

export default Mint;
