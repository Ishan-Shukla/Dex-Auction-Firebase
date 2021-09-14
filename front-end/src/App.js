import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import MarketPlace from "./pages/MarketPlace";
import MyAssets from "./pages/MyAssets";
import Mint from "./pages/MyAssets/Mint";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/MyAssets">
            <MyAssets />
          </Route>
          <Route exact path="/MarketPlace">
            <MarketPlace />
          </Route>
          <Route exact path="/MyAssets/Mint">
            <Mint />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
