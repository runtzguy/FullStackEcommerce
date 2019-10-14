const loggedReducer = (state, action) => {
    switch (action.type){
        case 'LOGGED_IN':
            return {auth: action.payload};
        //Default is for Log out
        default:
            return {...state};
    }
};

export default loggedReducer;