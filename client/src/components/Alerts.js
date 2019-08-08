import React, { Component } from 'react';
import '../App.css';
import {showErrors} from '../actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';



class Alerts extends Component {
    
    render(){
       if((this.props.errorAlerts.errors).length > 0){
           let errArr = this.props.errorAlerts.errors;
           return(
                errArr.map(err => {
                    return <div className="danger">{err}</div>
                })
           )
            
       }
       return (<span></span>)
        
    }
}
function mapStateToProps(state){
    return {
        errorAlerts : state.errorAlerts
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({showErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Alerts);