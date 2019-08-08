import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {useSelector, useDispatch, connect} from 'react-redux';

import {isLoggedIn, loggedFirstName, loggedLastName, showErrors, clearErrors} from '../actions/index'


class Signup extends Component {
    constructor(){
        super();
        this.state = {
            fname : "",
            lname : "",
            email : "",
            pw1 : "",
            pw2 : ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        //Clears error alerts when navigating back to this component
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }
    }
    
    handleSubmit(e){
        //Prevents page from reloading and navigating away.
        e.preventDefault();
        let formData =  new FormData(e.target);
        //Outputs data from the formData in this pattern: key value
    
        fetch('/user/signUp', {
            method : 'post',
            body : formData,
            headers : {
                'Accept' : 'application/json'
            }
        }).then((response) =>{
            return (response.json().then( d=> {return JSON.parse(JSON.stringify(d))}))
        }).then((data)=>{
            let errorArr = data.errors;
                errorArr.forEach((err)=>{
                    this.props.showErrors(err.msg)
                })
        })

    }
    handleChange(e){
        let keyName = e.target.name;
        this.setState({[keyName] : e.target.value})
    }
    render(){
        return (
            <form className="forms" id="signupForm" onSubmit={this.handleSubmit} method="POST">
                <div className="form-row">
                    <label>First Name: </label>
                    <input type="text" name="fname" value={this.state.fname} onChange={this.handleChange} required/>
                </div>
                <div className="form-row">
                    <label>Last Name: </label>
                    <input type="text" name="lname" value={this.state.lname} onChange={this.handleChange} required/>
                </div>
                <div className="form-row">
                    <label>Email: </label>
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} required/>   
                </div>
                <div className="form-row">
                    <label>Password: </label>
                    <input type="password" name="pw1" value={this.state.pw1} onChange={this.handleChange} required/>
                </div>
                <div className="form-row">
                    <label>Repeat Password: </label>
                    <input type="password" name="pw2" value={this.state.pw2} onChange={this.handleChange} required/>
                </div>
                <input type="submit" value="Submit!"/>
            </form>
        )
    }
}
function mapStateToProps(state){
    return {
        loggedUserName : state.loggedUserName,
        errorAlerts : state.errorAlerts
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({loggedFirstName,loggedLastName,isLoggedIn, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Signup);