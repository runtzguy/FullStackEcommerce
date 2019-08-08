import React, { Component } from 'react';
import '../App.css';
import img from '../img/home-page.jpg';

import {useSelector, useDispatch, connect} from 'react-redux';
import {isLoggedIn, loggedFirstName, loggedLastName} from '../actions/index'
import {bindActionCreators} from 'redux'

class Landing extends Component {
   
    render(){
        return (
            <div className="home-image">
                <img src={img} alt="Error loading" ></img>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        loggedUserName : state.loggedUserName
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({loggedFirstName,loggedLastName}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Landing);