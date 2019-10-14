import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, loggedUsername, showErrors, clearErrors} from '../actions/index';
//CSS Style
import '../css/shoetile.css';
//Components
import ShoeInfo from './ShoeInfo';
import ShoeQuantity from './ShoeQuantity';
import Additem from './AddItem'

class ShoeTile extends Component {
    render(){
        return (
            <div className="shoe-tile">
                <ShoeInfo 
                    name={this.props.shoe.name} 
                    imgURL={this.props.shoe.imgURL} 
                    descript={this.props.shoe.description} 
                    price={this.props.shoe.price}
                />
                <ShoeQuantity
                    name={this.props.shoe.name} 
                    quantity={this.props.quantity}
                    inputChange={this.props.inputChange}    
                />
                <Additem
                    isSelected={this.props.isSelected} 
                    selected={this.props.selected}
                    name={this.props.shoe.name} 
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
export default connect(mapStateToProps, matchDispatchToProps)(ShoeTile);