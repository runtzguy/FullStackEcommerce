import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react'
//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//Styling
import '../css/modal.css';
//
import {isLoggedIn, showErrors, clearErrors} from '../actions/index';
//
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
//Components
import ItemModal from './ItemModal';
import Checkout from './Checkout';
import Alerts from './Alerts';

export class ModalContent extends Component {
  constructor(){
    super();
    // this.checkoutItems = this.checkoutItems.bind(this);
  }
  render() {
    let shoes = this.props.shoes;
    return ReactDOM.createPortal(
      <FocusTrap>
        <aside
          aria-modal="true" 
          className="modal-cover"
          tabIndex="-1"
          onClick={this.props.onClickOutside}
          onKeyDown={this.props.onKeyDown}
        >
          <div className="modal-area" ref={this.props.modalRef}>
            <button 
              className="_modal-close"
              ref={this.props.buttonRef}
              aria-label="Close Modal"
              aria-labelledby="close-modal"
              onClick={this.props.closeModal} 
            >
              <span className="_hide-visual">Close</span>
              <FontAwesomeIcon 
                icon="times-circle" 
              />
            </button>
            <div className="modal-body">
              <Alerts/>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {shoes.map((shoe) => 
                      <ItemModal
                        key={shoe.name}
                        name={shoe.name}
                        quantity={shoe.quantity}
                        selected={shoe.selected}
                        price={shoe.price}
                        isSelected={this.props.isSelected}
                        inputChange={this.props.inputChange}
                        className="item"
                      />
                  )}
                </tbody>
              </table>
              <Checkout
                // checkoutItems={this.checkoutItems}
                selectedShoes={shoes}
              />
            </div>

          </div>
        </aside>
      </FocusTrap>,
      document.body
    );
  }
}
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
function mapStateToProps(state){
  return {
      loggedUserName : state.loggedUserName,
      errorAlerts : state.errorAlerts,
      loggedIn : state.isLogged, 
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({isLoggedIn, showErrors, clearErrors}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ModalContent);