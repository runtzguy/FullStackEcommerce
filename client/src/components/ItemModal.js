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
import '../css/cart-items.css';


class ItemModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            name : props.name,
            price : props.price,
            quantity : props.quantity,
            selected : props.selected,
        }
        this.isSelected = this.isSelected.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }
    isSelected(){
        this.props.isSelected(this.state.selected, this.state.name);
        this.setState({
           selected : false,
        })
    }
    inputChange(e, name){
        let currV = e.target.value === "" ? 0 : e.target.value;
        let inputValue = parseInt(currV);
        this.props.inputChange(inputValue, name);
        this.setState({quantity : inputValue});
    }
    render(){
        let total = priceTotal(this.state.quantity, this.state.price);
        return (
            <tr className="modal-item">
                <td>{this.state.name}</td>
                <td>${this.state.price}</td>
                <td><input className="quantity" type="number" min="0" step="1" onChange={e => {this.inputChange(e, this.state.name) }} value={this.state.quantity}/></td>
                <td>${total}</td>
                <td> <FontAwesomeIcon className="trash" icon="trash-alt" onClick={this.isSelected}/></td>
            </tr>
        )
    }
}
function priceTotal(quantity, price){
    return (quantity * price).toFixed(2);
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
export default connect(mapStateToProps, matchDispatchToProps)(ItemModal);