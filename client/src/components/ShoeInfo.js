import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, loggedUsername, showErrors, clearErrors} from '../actions/index';
//CSS Style
import '../css/shoetile.css';
//Images URL context
var images = require.context('../css/shoe-tile-imgs', true);


function ShoeInfo(props){
    return (
        <div className="info-container">
            <img src={images(`./${props.imgURL}`)} alt="No Image"></img>
            <h2>{props.name} - ${props.price}</h2>
            <p>{props.descript}
            </p>
        </div>
    )
}
function mapStateToProps(state){
    return {
        // loggedUserName : state.loggedUserName,
        // errorAlerts : state.errorAlerts,
        // loggedIn : state.isLogged,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({isLoggedIn, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ShoeInfo);