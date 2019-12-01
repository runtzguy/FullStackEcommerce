import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom'


class NavForm extends Component {
    
    constructor(){
        super();
        this.state = {
            tabSignup : {background : 'rgb(228, 228, 228)'},
            tabLogin : {background : 'white'}
        }
        this.changeTab = this.changeTab.bind(this);
    }
    changeTab(e){
        let tab = e.target.dataset.value;
        if (tab === 'signup'){
            this.setState({ 
                tabSignup : {background : 'white'}, 
                tabLogin : {background : 'rgb(228, 228, 228)'}
            })
        } else {
            this.setState({ 
                tabSignup : {background : 'rgb(228, 228, 228)'}, 
                tabLogin : {background : 'white'}
            })
        }
    }

    render(){
        return (
            <div className="tab-container">
                <Link 
                    id="tab-signup" 
                    to="/signup" 
                    onClick={this.changeTab}
                    style={ this.state.tabSignup} 
                    data-value="signup"> 
                    Sign Up
                </Link>
                <Link 
                    id="tab-login" 
                    to="/login" 
                    onClick={this.changeTab} 
                    style={ this.state.tabLogin} 
                    data-value="login">
                    Login
                </Link>
            </div>
        );
    }
}
export default NavForm;