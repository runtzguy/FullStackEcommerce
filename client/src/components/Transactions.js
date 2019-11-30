import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
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
    componentDidMount(){
        //TODO: Fetch transaction data from server
        let dataPromise = fetch('https://full-stack-ecommerce.herokuapp.com/userTransHist/', {
            method : 'post',
            headers : {
                'Accept' : 'application/json',
                'Authorization' : sessionStorage.getItem('token'),

            }
        }).then(response => {
            return new Promise( (resolve, reject) => {
                this.setState({statusCode : response.status});

                if(response.status === 200){
                    resolve(response.json());
                } else {
                    reject("Error with getting transaction data");
                }
            }) 
        })

        dataPromise.then(data=>{
            if(data.length !== 0){
                data = data.map(x => x.OR_DATE = x.OR_DATE.substring(0,10));
                this.setState({tData : [...data], isLoaded : true});
            } 
        }).catch(err => {
            console.error(err);
        })
    }

    //TODO: 1) Research react table library 
    //      2) Make table able to sort with columns in DESC and ASC order.
    render(){
        const columns = [{key : 'OR_ID', name: "Order ID"},
                         {key : 'OR_DATE', name: "Date"},
                         {key : 'PROD_ID', name: "Product ID"},
                         {key : 'PROD_Name', name: "Name"},
                         {key : 'OI_Quantity', name : "Quantity"}   
                        ];
        console.log("Status code: " + this.state.statusCode);
        if(this.state.isLoaded && this.state.statusCode === 200){
            if(this.state.tData.length > 0){
                return (
                    <ReactDataGrid
                        columns = {columns}
                        rowGetter={i => this.state.tData[i]}
                        rowsCount={10}
                    />)
            } else {
                return  <h3>You have no transaction history</h3> 
            }
        } else if (this.state.isLoaded && this.state.statusCode >= 0){
            return <h3>Error with Server. Please reload.</h3>
        } else {
            return <h3>Loading...</h3>
            
        }
    }
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