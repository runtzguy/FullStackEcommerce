const usernameReducer = (state, action) => {
    switch (action.type){
        case 'FIRST_NAME':
            return {...state, fName : action.payload}
        case 'LAST_NAME':
            return {...state, lName : action.payload}
        default:
            return {...state};
    }
};

export default usernameReducer;