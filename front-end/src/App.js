import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import MarketPlace from "./pages/MarketPlace";
import MyAssets from "./pages/MyAssets";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/MyAssets">
            <MyAssets/>
          </Route>
          <Route exact path="/MarketPlace">
            <MarketPlace/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
