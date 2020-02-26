import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Server Info
import serverInfo from './serverInfo';
//Actions
import {isLoggedIn, loggedLastName, loggedFirstName, showErrors, clearErrors} from '../actions/index';
//CSS Style
import '../css/account.css';


class Transactions extends Component {
    constructor(){
        super();
        this.state = {
            tData : [],
            isLoaded: false,
            statusCode : "",
        }
    }
    //TODO: 1) Fetch data and put in sessionStorage and state
    //      2) Do not fetch if sessionStorage is not empty
    //      3) Make a refresh button to fetch more data.
    componentDidMount(){
        //TODO: Fetch transaction data from server
        if(sessionStorage.getItem('history') != null){
            console.log(sessionStorage.getItem('history'));
        } else {
            fetch(`${serverInfo.url}/userTransHist/`, {
            method : 'post',
            headers : {
                'Accept' : 'application/json',
                'Authorization' : sessionStorage.getItem('token'),}
            })
            .then(handleErrors)
            .then(response => {
                return new Promise( (resolve, reject) => {
                    if(response.status === 200){
                        this.setState({statusCode : response.status});
                        resolve(response.json());
                    } else {
                        reject("Error with getting transaction data");
                    }
                }) 
            })
            .then( data=>{
                alert("where is this");
                console.log("Here " + data);
                if(data.length !== 0){
                    data = data.map(x => x.OR_DATE = x.OR_DATE.substring(0,10));
                    sessionStorage.setItem('history', JSON.stringify(data));
                    this.setState({tData : [...data], isLoaded : true});
                } 
            }).catch(err => {
                console.log("Error below: ")
                console.error(err);
            })
        }
        
    }

    render(){
        const columns = [{key : 'OR_ID', name: "Order ID"},
                         {key : 'OR_DATE', name: "Date"},
                         {key : 'PROD_ID', name: "Product ID"},
                         {key : 'PROD_Name', name: "Name"},
                         {key : 'OI_Quantity', name : "Quantity"}   
                        ];
        console.log("Status code: " + this.state.statusCode);
        if(this.state.isLoaded){
            if(this.state.tData.length > 0){
                console.log("Print Table")
                console.log(this.state.tData)
                return (
                    <ReactDataGrid
                        columns = {columns}
                        rowGetter={i => this.state.tData[i]}
                        rowsCount={10}
                        enableRowSelect={null}
                    />)
            } else {
                return  <h3>You have no transaction history</h3> 
            }
        } else if (this.state.statusCode === 503){
            return <h3>Error with Server. Please reload.</h3>
        } else {
            return <h3>Loading...</h3>
            
        }
    }
}
function handleErrors(response) {
    if (!response.ok) {
        throw new Error("Can't connect to Heroku server");
    }
    return response;
}
function mapStateToProps(state){
    return {
        loggedUsername : state.loggedUsername,
        errorAlerts : state.errorAlerts,
        loggedIn : state.isLogged,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({isLoggedIn, showErrors, clearErrors, loggedFirstName, loggedLastName}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Transactions);