import React, { Component } from 'react';
import '../App.css';
//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//Styling
import '../css/cart.css';


class Cart extends Component {
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


export default Cart;