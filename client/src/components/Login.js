import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../App.css';
import {bindActionCreators} from 'redux';
//Actions
import {isLoggedIn, loggedFirstName, loggedLastName, showErrors, clearErrors, successErrors} from '../actions/index'

//Renders Login component
class Login extends Component {
    constructor(){
        super();
        this.state = {
            email : "",
            pw : "",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    //Clears error alerts when navigating back to this component
    componentDidMount(){
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }
    }

    handleSubmit(e){
        e.preventDefault();
        let data = new FormData(e.target);
        //Clear initial alerts
        if(this.props.errorAlerts){
            this.props.clearErrors();
        }
        //https://full-stack-ecommerce.herokuapp.com
        fetch('https://full-stack-ecommerce.herokuapp.com/user/login', {
            method : 'post',
            body : data,
            headers : {
                'Accept' : 'application/json'
            }
        })
        .then(response => new Promise((resolve, reject) => {
                let resStatus = response.status;
                if(resStatus === 200){
                    //Login Successful
                    response.json().then( e => {
                        let fName = e.fName;
                        let lName = e.lName;
                        let isLoggedIn = e.isLoggedIn;
                        let msg = e.msg;
                        
                        //Set token in Session Storage
                        sessionStorage.setItem('token', e.token);
                        //Set State in Redux
                        this.props.loggedFirstName(fName);
                        this.props.loggedLastName(lName);
                        this.props.isLoggedIn(isLoggedIn);
                        this.props.successErrors(msg);
                        
                    })
                    
                } else if (resStatus === 307){
                    //Request received but return error status 307
                    console.log("Error status: 307");
                } else {
                    reject(response);
                }
                
            })
        )
        .catch(err => {
            console.log(err);
            //Request received but returned error response
            if(err.json != null){
                err.json()
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
    }
    //Allows user to edit input box
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
function mapStateToProps(state){
    return {
        loggedUserName : state.loggedUserName,
        errorAlerts : state.errorAlerts
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({loggedFirstName,loggedLastName,isLoggedIn, showErrors, clearErrors, successErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Login);