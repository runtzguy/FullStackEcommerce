const errorsReducer = (state, action) => {
    switch (action.type){
        case 'ERRORS':
            return {...state, errors: [...state.errors, action.payload]};
        case 'CLEAR_ERRORS':
            return {errors: []}
        default:
            return {...state, errors: []};
    }
};

export default errorsReducer;