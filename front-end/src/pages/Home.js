import React from "react";
// import { MetamaskProvider } from "../App";
// import { ethers } from 'ethers';
// import Web3Modal from "web3modal";
import Content from "../Components/Landing/Content";
import ViewCard from "../Components/Card/ViewCard";

const Home = () => {
  // const provider = useContext(MetamaskProvider);

  return (
    <>
      {/* <TopBar ConnectMe={selectedAccount} /> */}
      <div className="bg-Subtle-Background border-b-4 border-blue-100 border-opacity-90 shadow-bar border-dotted z-0 bg-cover bg-center min-h-screen">
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
