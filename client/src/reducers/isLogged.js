const loggedReducer = (state, action) => {
    switch (action.type){
        case 'LOGGED_IN':
            return {auth: action.payload};
        case 'LOGGED_OUT':
            return {auth: action.payload};
        default:
            return {...state};
    }
};

export default loggedReducer;