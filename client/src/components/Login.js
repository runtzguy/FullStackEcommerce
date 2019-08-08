import React, { Component } from 'react';
import {useSelector, useDispatch, connect} from 'react-redux';
import '../App.css';
import {bindActionCreators} from 'redux'

import {isLoggedIn, loggedFirstName, loggedLastName, showErrors, clearErrors} from '../actions/index'

class Login extends Component {
    constructor(){
        super();
        this.state = {
            email : "",
            pw : ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        //Clears error alerts when navigating back to this component
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }
    }

    handleSubmit(e){
        e.preventDefault();
        let data = new FormData(e.target);

        fetch('/user/login', {
            method : 'post',
            body : data,
            headers : {
                'Accept' : 'application/json'
            }
        }).then((response) =>{
            let resStatus = response.status;
            if(resStatus == 200){
                response.json()
                    .then( e => {
                        let fName = e.fName;
                        let lName = e.lName;
                        let isLoggedIn = e.isLoggedIn;

                        this.props.loggedFirstName(fName);
                        this.props.loggedLastName(lName);
                        this.props.isLoggedIn(isLoggedIn);

                    })
                
            } else if (resStatus == 307){
                console.log("307 ");
            }
            else {
                response.json()
                    .then( d => {
                        let errorData = JSON.stringify(d)
                        errorData = JSON.parse(errorData);
                        let errorArr = errorData.errors;
                        errorArr.forEach((err)=>{
                            this.props.showErrors(err.msg)
                        })


                    })
            }
            
        })
        .catch(err => {
            console.log(err);
        })
    }
    handleChange(e){
        let keyName = e.target.name;
        this.setState({[keyName] : e.target.value})
    }
    render(){
        return (
            <form className="forms" id="loginForm" onSubmit={this.handleSubmit} method="POST" >
                <div className="form-row">
                    <label>Email: </label>
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} required/>   
                </div>
                <div className="form-row">
                    <label>Password: </label>
                    <input type="password" name="pw" value={this.state.pw} onChange={this.handleChange} required />
                </div>
                <input type="submit" value="Submit!"/>
            </form>
        )
    }
}
/**
 *  mapStateToProps
 *      It takes 
 */
function mapStateToProps(state){
    return {
        loggedUserName : state.loggedUserName,
        errorAlerts : state.errorAlerts
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({loggedFirstName,loggedLastName,isLoggedIn, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Login);