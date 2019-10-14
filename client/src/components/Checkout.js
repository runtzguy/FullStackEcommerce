import React, { Component } from 'react';
import '../App.css';
//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//CSS Style
import '../css/checkout-button.css'

class Checkout extends Component{
    //TODO: 1) Do a check if user is logged in
    //      2) Send Request to server

    render(){
        return (
            <button className="checkout" onClick={this.isSelected}>Check Out</button>
        )
    }
}
export default Checkout; 