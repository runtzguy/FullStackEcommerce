import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//Actions
import {isLoggedIn, loggedUsername, showErrors, clearErrors} from '../actions/index';
//Styling
import '../css/cart.css';


class Cart extends Component {
    constructor(props){
        super(props);
        
    }
    render(){
        return (
            <div className="cart-container">
                <FontAwesomeIcon 
                    className="cart" 
                    icon="shopping-cart"
                    onClick={this.props.showModal}
                />
            </div>
        )
    }
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
export default connect(mapStateToProps, matchDispatchToProps)(Cart);