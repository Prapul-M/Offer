import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreateOffer from './components/CreateOffer';
import Profile from './components/Profile';
import Settings from './components/Settings';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/create-offer" component={CreateOffer} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
