import React, { Component } from 'react';
import '../App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';


//Components
import Login from './Login';
import Signup from './Signup';
import NavForm from './NavForm';
import Alerts from './Alerts'
//Redux Actions
import {clearErrors} from '../actions/index'

class LoginSignup extends Component {
    componentDidMount(){
        //Clears error alerts when navigating back to this component
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }
    }
    render(){
        if (this.props.loggedIn.auth){
            return (<Redirect to="./Account"/>);
        }
        return (
            <div>
                <Alerts/>
                <div className="form-container">
                    <Router>
                        <NavForm/>
                        <Switch>
                            <Route path="/components/Login" component={Login}/>
                            <Route path="/components/Signup" component={Signup}/>
                            <Route path="*" component={Login}/>
                        </Switch>
                    </Router>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        errorAlerts : state.errorAlerts,
        loggedIn : state.isLogged,
    }
  }
  
  function matchDispatchToProps(dispatch){
    return bindActionCreators({clearErrors}, dispatch)
  }
  export default connect(mapStateToProps, matchDispatchToProps)(LoginSignup);
