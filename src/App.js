import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WriteEntryNew from './components/WriteEntryNew';
import ReadEntry from './components/ReadEntry';
import SimpleMap from './components/SimpleMap';
import StyledTesting from './components/StyledTesting';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={LandingPage} />
          <Route path="/createaccount" component={CreateAccount} />
          <Route path="/login" component={Login} />
          <Route exact path="/dashboard" render={(props) => <Dashboard {...props} page={'entries'}/>} />
          <Route path="/dashboard/:page" render={(routeProps) => <Dashboard {...routeProps} page={routeProps.match.params.page}/>} />
          <Route path="/writeentry" component={WriteEntryNew} />
          <Route path="/readentry/:id" component={ReadEntry} />
          <Route path="/testingmap" component={SimpleMap} />
          <Route path="/styled" component={StyledTesting} />
          <footer style={{display: 'block', position: 'fixed', bottom: '5px', left: '1%', 'font-family': 'Barlow Semi Condensed', 'font-size': '1.2rem' }}>Zerina Djuheric © 2020</footer>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
