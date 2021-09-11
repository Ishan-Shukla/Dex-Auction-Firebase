import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import MyAssets from "./pages/MyAssets";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/MyAssets">
            <MyAssets/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
