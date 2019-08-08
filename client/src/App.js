import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';

import Landing from './components/Landing'
import LoginSignup from './components/LoginSignup'
import Navbar from './components/Navbar'

import {clearErrors} from './actions/index'

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar/>
          <Switch>
            <Route path="/components/Landing" component={Landing}/>
            <Route path="/components/LoginSignup" component={LoginSignup}/>
            {/* Must be placed at the end because it Route executes sequentially */}
            <Route path="" component={Landing}/>
          </Switch>
        </Router>
    </div>
  );
}

function mapStateToProps(state){
  return {
      errorAlerts : state.errorAlerts
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(App);

