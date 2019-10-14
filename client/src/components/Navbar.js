import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom'


class Navbar extends Component {
    render(){
        return (
            <div className="container">
                <h1>The Shoe Shop</h1>
                    <div className="nav-bar">
                        <Link to="/components/Landing"> 
                            <li>Home</li>
                        </Link>
                        <Link to="/components/Products">
                            <li>Products</li>
                        </Link>
                        <Link to="/components/LoginSignup">
                            <li>Login/Sign Up</li>
                        </Link>
                    </div>
            </div>
        );
    }
}
export default Navbar;