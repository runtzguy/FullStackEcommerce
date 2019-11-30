import React, { Component } from 'react';
import '../App.css';
//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//CSS Style
import '../css/shoetile.css';

class ShoeQuantity extends Component {
    constructor(props){
        super(props);
        this.state = {
            quantity : props.quantity,
            name : props.name,
        }
        this.inputChange = this.inputChange.bind(this);
    }
    inputChange(e, name){
        let currV = e.target.value === "" ? 0 : e.target.value;
        let inputValue = parseInt(currV);
        this.props.inputChange(inputValue, name);
        this.setState({quantity : inputValue});
    }
    minusChange(e,name){
        let currV = this.state.quantity === 0 ? 0 : this.state.quantity-1;
        this.props.inputChange(currV, name);
        this.setState({quantity : currV})
    }
    plusChange(e, name){
        let currV = this.state.quantity + 1;
        this.props.inputChange(currV, name);
        this.setState({quantity : currV})
    }
    render(){
        const name = this.state.name;
        return (
            <div className="q-container">
                <FontAwesomeIcon className="minus" onClick={e => this.minusChange(e,name)} icon="minus-circle"/>
                <input type="number" min="0" step="1" onChange={e => this.inputChange(e, name)} value={this.props.quantity} readOnly/>
                <FontAwesomeIcon className="plus" onClick={e => this.plusChange(e, name)} icon="plus-circle"/>
            </div>
        )
    }
}


export default ShoeQuantity;