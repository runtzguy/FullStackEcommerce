import React, { Component } from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, showErrors, clearErrors} from '../actions/index';

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
        let componentPath = empty ? "/loginsignup" : "/account";
        let linkNames = empty ? "Login/Sign Up" : "Account";
        return (
            <div className="container">
                <h1>The Shoe Shop</h1>
                    <div className="nav-bar">
                        <NavLink activeClassName="activeLink" to="/landing"><li>Home</li></NavLink>
                        <NavLink activeClassName="activeLink" to="/products"><li>Products</li></NavLink>
                        <NavLink activeClassName="activeLink" to={componentPath}><li>{linkNames}</li></NavLink>
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