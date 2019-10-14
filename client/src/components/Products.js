import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, loggedUsername, showErrors, clearErrors} from '../actions/index';
//Components
import ShoeTile from './ShoeTile';
import Cart from './Cart';
import Modal from './Modal';

//Styling
const productsStyle = {
    display: 'flex',
    padding: '20px',
    justifyContent : 'space-evenly',
    flexWrap : 'wrap',
}
class Products extends Component {
    constructor(){
        super();
        this.state = {
            userLoggedIn : "",
            shoes : [
                {name : "Nike Men Air", imgURL: 'item1.jpg', description: "Cool sneakers", quantity: 0, selected : false,price: "49.99"},
                {name : "Generic Running Shoe", imgURL: 'item2.jpg', description: "You wont regret it", quantity: 0, selected : false, price: "50.00"},
                {name : "Nike Fly High", imgURL: 'item3.jpg', description: "Buy me!", quantity: 0, selected : false, price: "60.99"},
                {name : "Adidas Pink Sneakers", imgURL: 'item4.jpg', description: "So Cheap!", quantity: 0, selected : false, price: "20.20"},
            ]
        }
        this.inputChange = this.inputChange.bind(this);
        this.isSelected = this.isSelected.bind(this);   
    }
    componentDidMount(){
        //Sets user authorization to local component's state
        if(this.props.loggedIn.auth){
            this.setState({userLoggedIn : this.props.loggedIn.auth}) 
        }
    }
    inputChange(inputValue, name){
        let newArray = this.state.shoes.map((e) =>{
            let temp = Object.assign({}, e)
            if(temp.name === name){
                temp.quantity = inputValue;
            }
            return temp;
        })
        this.setState( {
           shoes : [...newArray]

        });
    }
    isSelected(selected, name){
        let newArray = this.state.shoes.map((e) =>{
            let temp = Object.assign({}, e)
            if(temp.name === name){
                temp.selected = !selected;
            }
            return temp;
        })
        this.setState( {
           shoes : [...newArray]

        });
    }
    render(){
        let shoes = this.state.shoes;
        let selectedShoes = shoes.filter((shoe)=>{
            if(shoe.selected === true){
                return shoe;
            }
        })
        return (
            <div style={productsStyle}>
                <Modal 
                    shoes={selectedShoes}
                    isSelected={this.isSelected}
                    inputChange={this.inputChange}
                />
                {shoes.map((shoe, i) => 
                    <ShoeTile 
                        key={i} 
                        shoe={shoe} 
                        quantity={shoe.quantity} 
                        inputChange={this.inputChange}
                        selected={shoe.selected}
                        isSelected={this.isSelected}
                    />
                )}

            </div>
        )
    }
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
export default connect(mapStateToProps, matchDispatchToProps)(Products);