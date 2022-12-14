import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import TopBar from "./Components/Header/TopBar";
import Navbar from "./Components/NavBar/NavBar";
import Home from "./pages/Home";
import MyAssets from "./pages/MyAssets";
import MarketPlace from "./pages/MarketPlace";
import { useHistory } from "react-router";
import loading from "./img/Loading.svg";
import UseTitle from "./Components/Title/UseTitle";

// Context for
// User Account and Metamask Provider
export const MetamaskProvider = React.createContext();
export const UserAccount = React.createContext();

function App() {
  const [Account, setAccount] = useState(0); // User account of logged in user
  const [provider, setProvider] = useState(0); // Metamask Provider
  const [loadingState, setLoadingState] = useState("not-loaded"); // Loading state for main return
  const [chainLock, setchainLock] = useState(false); // true if invalid chain Id
  const history = useHistory();

  const web3modal = new Web3Modal(); // Instance of Web3Modal
  let web3; // web3 connect

  // Set Title
  UseTitle("DexAuction");

  // UseEffect + LoadingState
  useEffect(() => {
    if (loadingState === "not-loaded") {
      Connect(); // Connects to Loading state on start and with change in loading state
    }
  }, [loadingState]);

  // Connects to Metamask
  const Connect = async () => {
    web3 = await web3modal.connect();

    // Sets Provider
    setProvider(new ethers.providers.Web3Provider(web3));

    const selectedAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Sets user Account (i.e. Ethereum address)
    setAccount(() => selectedAccount);

    // Sets loading state to loaded
    setLoadingState("loaded");

    console.log("📡📡📡 Connected To Web3 📡📡📡");

    if (parseInt(web3.chainId) !== 1337) {
      console.log(`Wrong ChainId: ${parseInt(web3.chainId)}`);
      setchainLock(true);
    }

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      console.log("Account Changed From: " + Account);
      console.log("Account Changed To: " + accounts);
      history.replace("/");
      setLoadingState("not-loaded");
    });

    // Subscribe to chainId change
    web3.on("chainChanged", (chainId) => {
      if (parseInt(chainId) !== 1337) {
        console.log("Wrong ChainId: " + chainId);
        if (!chainLock) {
          setchainLock(true);
        }
      } else {
        setchainLock(false);
        history.replace("/");
        setLoadingState("not-loaded");
      }
    });
  };

  // Connect to Metamask or Install Metamask
  if (loadingState !== "loaded") {
    return (
      <div className="mx-auto text-center mt-40 mb-40 text-4xl font-semibold">
        Connect to Metamask
      </div>
    );
  }

  // if not connected to chainId other than 1337
  if (chainLock) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <img src={loading} alt="Loading" className="h-20" />
      </div>
    );
  }

  // If everyThing goes well
  return (
    <Router>
      <MetamaskProvider.Provider value={provider}>
        {/* Provides Metamask Provider to other Components */}
        <div className="App">
          <Navbar />
          {/* Side Floating navigation bar to navigate b/w MyAssets & Marketplace */}
          <div>
            <Switch>
              <Route exact path="/">
                <Home /> {/* Landing Page */}
              </Route>
              <UserAccount.Provider value={Account}>
                <Route exact path="/Market">
                  <TopBar /> {/* Top Frosted Glass bar with DexAuction Logo */}
                  <MarketPlace /> {/* MarketPlace Page */}
                </Route>
                <Route exact path="/MyAssets">
                  <TopBar /> {/* Top Frosted Glass bar with DexAuction Logo */}
                  <MyAssets /> {/* MyAssets page */}
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
