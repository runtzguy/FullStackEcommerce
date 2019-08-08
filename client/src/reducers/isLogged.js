const loggedReducer = (state, action) => {
    switch (action.type){
        case 'LOGGED_IN':
            return {auth: action.payload};
        //Default is for Log out
        default:
            return {auth: false};
    }
};

export default loggedReducer;