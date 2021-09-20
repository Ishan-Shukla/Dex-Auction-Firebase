import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import TopBar from "./Components/Header/TopBar";
import Navbar from "./Components/NavBar/NavBar";
import Home from "./pages/Home";
import MyAssets from "./pages/MyAssets";
import { Test } from "./pages/Test";
import MarketPlace from "./pages/MarketPlace";
// import Market from "./pages/Market";
// import MarketPlace from "./pages/MarketPlace";

export const MetamaskProvider = React.createContext();
export const UserAccount = React.createContext();

function App() {
  // const [connected, setStatus] = useState(false);
  const [Account, setAccount] = useState(0);
  const [provider, setProvider] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const web3modal = new Web3Modal({});
  let web3;
  let selectedAccount = 0;

  useEffect(() => {
    Connect();
  }, []);

  const Connect = async () => {
    web3 = await web3modal.connect();
    setProvider(new ethers.providers.Web3Provider(web3));
    selectedAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(() => selectedAccount);
    setLoadingState("loaded");
    // console.log(window.ethereum);
    // console.log(typeof(window.ethereum));
    // console.log(parseInt(window.ethereum.chainId));
    // console.log(window.ethereum.isMetaMask);
    // console.log(web3modal);
    // console.log(web3);
    // console.log(provider);
    // console.log(loadingState);
    // console.log(await (await provider.getNetwork()).chainId);
    // console.log(selectedAccount);
    // console.log(Account);

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
  };

  if (loadingState !== "loaded") {
    return <h1>Loading</h1>;
  }

  return (
    <Router>
      <MetamaskProvider.Provider value={provider}>
        <div className="App">
          <TopBar />
          <Navbar />
          <div>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <UserAccount.Provider value={Account}>
                <Route exact path="/Market">
                  <MarketPlace />
                </Route>
                <Route exact path="/MyAssets">
                  <MyAssets />
                </Route>
              </UserAccount.Provider>
            </Switch>
          </div>
        </div>
      </MetamaskProvider.Provider>
    </Router>
  );
}

export default App;
