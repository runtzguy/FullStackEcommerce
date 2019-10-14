import React, { Component } from 'react';
import '../App.css';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Actions
import {isLoggedIn, loggedUsername, showErrors, clearErrors} from '../actions/index';
//Components
import Cart from './Cart'
import ModalContent from './ModalContent'

class Modal extends Component {
    constructor(props){
        super(props);
        this.state = {
            isShown : false,
        }
    }
    showModal = () => {
        this.setState({ isShown: true }, () => {
          this.closeButton.focus();
        });
        this.toggleScrollLock();
      };
      closeModal = () => {
        this.setState({ isShown: false });
        this.toggleScrollLock();
      };
      onKeyDown = event => {
        if (event.keyCode === 27) {
          this.closeModal();
        }
      };
      onClickOutside = event => {
        if (this.modal && this.modal.contains(event.target)) return;
        this.closeModal();
      };
    
      toggleScrollLock = () => {
        document.querySelector('html').classList.toggle('scroll-lock');
      };
    render(){
        let shoes = this.props.shoes;
        return (
            <React.Fragment>
                <Cart 
                    showModal={this.showModal}
                />
                {this.state.isShown ?
                    <ModalContent
                        shoes={shoes}
                        isSelected={this.props.isSelected}
                        modalRef={n => (this.modal = n)}
                        buttonRef={n => (this.closeButton = n)}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
                        inputChange={this.props.inputChange}
                    />:
                    <React.Fragment/>
                }
            </React.Fragment>
        )
    }
}
function mapStateToProps(state){
    return {
        // loggedUserName : state.loggedUserName,
        // errorAlerts : state.errorAlerts,
        // loggedIn : state.isLogged,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({isLoggedIn, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Modal);