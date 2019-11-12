import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect, useSelector} from 'react-redux';
//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Actions
import {isLoggedIn, successErrors,showErrors, clearErrors} from '../actions/index';
//CSS Style
import '../css/checkout-button.css';

class Checkout extends Component{
    constructor(){
        super()
        this.clickCheckout = this.clickCheckout.bind(this);
    }
    //Clears error alerts when navigating back to this component
     componentDidMount(){
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }
    }
    clickCheckout(){
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }

        if( this.props.selectedShoes.length == 0 ){
            this.props.showErrors('No items in Shopping Cart')
            return;
        }
         
        if(isEmpty(this.props.loggedIn) || this.props.loggedIn.auth == false){
            this.props.showErrors('Only registered users can check out items. Please Register or Login');
            return;
        } 
        if(!checkCartForEmptyItem(this.props.selectedShoes)){
            // let token = {'token' : sessionStorage.getItem('token')};
            // //Store token and data to new array obj
            // let addedTokenData = this.props.selectedShoes.map((obj)=> {return obj});
            // addedTokenData.push(token);
            let data = JSON.stringify(this.props.selectedShoes);
            console.log("Logged in")
            fetch('/checkout', {
                method : 'post',
                body : data,
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : sessionStorage.getItem('token'),

            }})
            .then(res => {
                this.props.successErrors('Successfully Checked Out!')
                console.log(res.json());
            })
        } else {
            this.props.showErrors('Item(s) cannot have quantity of 0');
            return;
        }
    }
    render(){
        return (
            <button className="checkout" onClick={this.clickCheckout}>Check Out</button>
        )
    }
}
function checkCartForEmptyItem(shoes){
    for(let x = 0; x < shoes.length; x++){
        if(shoes[x].quantity == 0){
            return true;
        }
    }
    return false;
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
        loggedUserName : state.loggedUserName,
        errorAlerts : state.errorAlerts,
        loggedIn : state.isLogged, 
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({isLoggedIn, successErrors, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Checkout);