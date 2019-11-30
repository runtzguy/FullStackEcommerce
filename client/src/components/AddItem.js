import React, { Component } from 'react';
import '../App.css';
//CSS Style
import '../css/shoetile.css';

class AddItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : "", 
            selected : false,
        };
        this.isSelected = this.isSelected.bind(this);
    }
    componentDidMount(){
        let propsData = JSON.parse(JSON.stringify(this.props));
        this.setState({name : propsData.name })
    }
    isSelected(){
        const name = this.state.name;
        let selected = this.state.selected;
        this.props.isSelected(selected, name);
    }
    render(){
        return (
            <button className="addToCart" onClick={this.isSelected}>Add to Cart</button>
        )
    }
}
export default AddItem; 