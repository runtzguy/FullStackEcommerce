import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {showErrors} from '../actions/index'
import {successErrors} from '../actions/index'

// Renders Alerts
class Alerts extends Component {
    render(){
        //Checks Redux store "errorAlerts" property if empty and shows errors if not empty
       if((this.props.errorAlerts.errors).length > 0){
           let errArr = this.props.errorAlerts.errors;
           return(  errArr.map(err => { return <div className="danger">{err}</div>  }))
       }
       // TODO: Implement action and reducer in Redux
       if((this.props.errorAlerts.success)){
            let succArr = this.props.errorAlerts.success;
            return(  succArr.map(succ => { return <div className="success">{succ}</div>  }))
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
    return bindActionCreators({showErrors, successErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Alerts);