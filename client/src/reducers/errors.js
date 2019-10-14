const errorsReducer = (state, action) => {
    switch (action.type){
        case 'ERRORS':
            return {...state, errors: [...state.errors, action.payload]};
        case 'SUCCESS':
            return {...state, success: [action.payload]};
        case 'CLEAR_ERRORS':
            return { errors: [], success: []}
        default:
            return {...state, errors: [], success: []};
    }
};

export default errorsReducer;