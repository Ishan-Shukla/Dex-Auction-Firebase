import React, { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import TopBar from "../Components/Header/TopBar";
import Navbar from "../Components/NavBar/NavBar";

function MyAssets() {
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const web3modal = new Web3Modal({ cacheProvider: true });
  let web3;
  let provider;
  let selectedAccount;
  const [connected, setStatus] = useState(false);
  const Connect = async () => {
    console.log(window.ethereum);
    console.log(typeof window.ethereum);
    console.log(parseInt(window.ethereum.chainId));
    console.log(window.ethereum.isMetaMask);
    console.log(web3modal);
    web3 = await web3modal.connect();
    console.log(web3);
    provider = new ethers.providers.Web3Provider(web3);
    console.log(provider);
    console.log(await (await provider.getNetwork()).chainId);
    selectedAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(selectedAccount);

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      // console.log(accounts);
      selectedAccount = accounts[0];
      console.log(selectedAccount);
      // selectedAccount = accounts
    });

    // Subscribe to chainId change
    web3.on("chainChanged", (chainId) => {
      console.log(parseInt(chainId));
    });

    // Subscribe to disconect
    web3.on("disconnect", (err) => {
      console.log(err);
    });
  };
  const Disconnect = async () => {
    const clear = await web3modal.clearCachedProvider();
    console.log(clear);
  };
  const Metamask = async () => {
    if (connected) {
      Disconnect();
      setStatus(false);
    } else {
      Connect();
      setStatus(true);
    }
  };
  return (
    <div>
      <TopBar ConnectMe={Metamask} />
      <Navbar />
    </div>
  );
}

export default MyAssets;
