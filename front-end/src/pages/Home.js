import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Content from "../Components/Landing/Content";
import { NFTsView } from "./HomeView/NFTViewHome";
import { NFTHome } from "./HomeView/NFTHome";

const Home = () => {
  return (
    <Router>
      <Route exact path="/">
        {/* <div className="bg-Turquoise-Blurred bg-fixed bg-cover"> */}
          <div className="bg-Subtle-Background shadow-bar bg-cover bg-center min-h-screen">
            <Content /> {/* Starting screen Content */}
          </div>
          <div>
            <NFTHome /> {/* NFTs Card view */}
          </div>
        {/* </div> */}
      </Route>
      <Route path="/NFT/:id">
        <NFTsView /> {/* Particular NFT's details */}
      </Route>
    </Router>
  );
};

export default Home;
