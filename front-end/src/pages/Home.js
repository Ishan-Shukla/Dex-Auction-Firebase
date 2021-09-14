import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import Content from "../Components/Landing/Content";
import Navbar from "../Components/NavBar/NavBar";
import TopBar from "../Components/Header/TopBar";
import ViewCard from "../Components/Card/ViewCard";

function Home() {
  const [connected,setStatus] = useState(false);
  const [Account, setAccount] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  
  const web3modal = new Web3Modal({});
  let web3;
  let provider;
  let selectedAccount=0;

  useEffect(() => {
    Connect();
  }, []);

  const Connect = async () => {
    web3 = await web3modal.connect();
    provider = new ethers.providers.Web3Provider(web3);
    selectedAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount( () => selectedAccount);

    console.log(window.ethereum);
    console.log(typeof(window.ethereum));
    console.log(parseInt(window.ethereum.chainId));
    console.log(window.ethereum.isMetaMask);
    console.log(web3modal);
    console.log(web3); 
    console.log(provider);
    console.log(await (await provider.getNetwork()).chainId);
    console.log(selectedAccount);
    console.log(Account);

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      // console.log(accounts);
      selectedAccount = accounts[0];
      setAccount(selectedAccount);
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
  }

  return (
    <>
      <TopBar ConnectMe={selectedAccount} />
      <div className="bg-Subtle-Background border-b-4 border-blue-100 border-opacity-90 shadow-bar border-dotted z-0 bg-cover bg-center min-h-screen">
        <Navbar />
        <Content />
      </div>
      <div className="mt-20">
        <ViewCard />
        <ViewCard />
        <ViewCard />
        <ViewCard />
        <ViewCard />
        <ViewCard />
        <ViewCard />
        <ViewCard />
        <ViewCard />
      </div>
    </>
  );
}

export default Home;
