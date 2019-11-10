import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faMinusCircle, faPlusCircle, faShoppingCart, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
//Components
import Landing from './components/Landing'
import LoginSignup from './components/LoginSignup'
import Navbar from './components/Navbar'
import Products from './components/Products'
import Account from './components/Account'
//Actions
import {clearErrors} from './actions/index'

library.add(fab, faMinusCircle, faPlusCircle, faShoppingCart, faTimesCircle, faTrashAlt)
function App() {
  return (
    <div className="App">
        <Router>
          <Navbar/>
          <Switch>
            <Route path="/components/Landing" component={Landing}/>
            <Route path="/components/LoginSignup" component={LoginSignup}/>
            <Route path="/components/Account" component={Account}/>
            {/* Must be placed at the end because it Route executes sequentially */}
            <Route path="/components/Products" component={Products}/>
            <Route path="/" component={Landing}/>
          </Switch>
        </Router>
    </div>
  );
}
// Takes the errorAlertsReducer from the store and maps it to this component 
// and attaches to errorAlerts
function mapStateToProps(state){
  return {
      errorAlerts : state.errorAlerts
  }
}
// binds dispatch to the clearErrors action
function matchDispatchToProps(dispatch){
  return bindActionCreators({clearErrors}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);

