import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useLocation} from "react-router-dom";
import Content from "../Components/Landing/Content";
import { NFTsView } from "./HomeView/NFTViewHome";
import { NFTHome } from "./HomeView/NFTHome";
import { useHistory } from "react-router";

const Home = () => {
  const [status, setStatus] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const path = location.pathname;
    console.log("Location state");
    console.log(location.state);
    console.log("---------------");
  }, [location]);

  const changeStatus = () => {
    setLoadingState("not-loaded");
  };

  return (
    <Router>
      <Route exact path="/">
        <div className="bg-Subtle-Background shadow-bar z-0 bg-cover bg-center min-h-screen">
          <Content />
        </div>
        <div className="min-h-screen">
          <NFTHome />
        </div>
      </Route>
      <Route path="/NFT/:id">
        <NFTsView />
      </Route>
    </Router>
  );
};

export default Home;
