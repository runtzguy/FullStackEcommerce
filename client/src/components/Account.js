import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import  { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, isLoggedOut, removeUserFromRedux, loggedLastName, loggedFirstName, showErrors, clearErrors} from '../actions/index';
//CSS Style
import '../css/account.css';
//Components
import Transactions from './Transactions';

class Account extends Component {
    constructor(){
        super();
        this.state = {
            navigateToLanding : false,
        }
        this.signOut = this.signOut.bind(this);
    }

    signOut(){
        this.props.isLoggedOut(false);
        this.props.removeUserFromRedux();
        sessionStorage.setItem("token", "");
        sessionStorage.setItem("history", "");
        this.setState({navigateToLanding : true});

    }
    render(){
        let fName;
        let lName;
        if (this.state.navigateToLanding){
            return (<Redirect to="./Landing"/>);
        }

        if(isEmpty(this.props.loggedIn)){
            return (<Redirect to="./LoginSignup"/>);
        } else {
            fName = this.props.loggedUsername.fName;
            lName = this.props.loggedUsername.lName;
        }

        return (
            <div className="account-container">
                <h1 className="welcome">Welcome {fName + " " + lName}!</h1>
                <button className="sign-out" onClick={this.signOut}>Sign out</button>
                <h2 className="title">Transaction History:</h2>
                <div className="trans"><Transactions/></div>
            </div>
        
        )
    }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function mapStateToProps(state){
    return {
        loggedUsername : state.loggedUsername,
        errorAlerts : state.errorAlerts,
        loggedIn : state.isLogged,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({isLoggedIn, isLoggedOut , removeUserFromRedux, showErrors, clearErrors, loggedFirstName, loggedLastName}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Account);