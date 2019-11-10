import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, loggedUsername, showErrors, clearErrors} from '../actions/index';

class Navbar extends Component {
    render(){
        let empty;
        if(isEmpty(this.props.loggedIn)){
            empty = true;
        } else if(!this.props.loggedIn.auth) {
            empty = true;
        } else{
            empty = false;
        }
        let componentPath = empty ? "/components/LoginSignup" : "/components/Account";
        let linkNames = empty ? "Login/Sign Up" : "Account";
        return (
            <div className="container">
                <h1>The Shoe Shop</h1>
                    <div className="nav-bar">
                        <Link to="/components/Landing"><li>Home</li></Link>
                        <Link to="/components/Products"><li>Products</li></Link>
                        <Link to={componentPath}><li>{linkNames}</li></Link>
                    </div>
            </div>
        );
    }
}
function isEmpty(obj) {
    //Used to check if the state in Redux is an empty object.
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
function mapStateToProps(state){
    return {
        loggedUserName : state.loggedUserName,
        errorAlerts : state.errorAlerts,
        loggedIn : state.isLogged,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({isLoggedIn, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Navbar);