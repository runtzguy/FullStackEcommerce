import { combineReducers } from 'redux';
import loggedReducer  from './isLogged';
import usernameReducer from './username';
import errorsReducer from './errors';

const allReducer = combineReducers({
    isLogged : loggedReducer,
    loggedUsername : usernameReducer,
    errorAlerts : errorsReducer
})

export default allReducer;