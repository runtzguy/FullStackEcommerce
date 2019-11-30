import React, { Component } from 'react';
import '../App.css';
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

export default Modal;