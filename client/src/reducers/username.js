const usernameReducer = (state, action) => {
    switch (action.type){
        case 'FIRST_NAME':
            return {...state, fName : action.payload}
        case 'LAST_NAME':
            return {...state, lName : action.payload}
        case 'REMOVE_USER_FROM_REDUX':
            return {fName : "", lName : ""}
        default:
            return {...state};
    }
};

export default usernameReducer;