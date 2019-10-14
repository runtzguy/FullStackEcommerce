export const isLoggedIn = (status) => {
    return {
        type: 'LOGGED_IN',
        payload: status
    }
}

export const loggedFirstName= (fname) => {
    return {
        type: 'FIRST_NAME',
        payload: fname
    }
}

export const loggedLastName = (lname) =>{
    return {
        type: 'LAST_NAME',
        payload: lname
    }
}

export const showErrors = (error) => {
    return {
        type: 'ERRORS',
        payload: error
    }
}

export const clearErrors = () => {
    return {
        type: 'CLEAR_ERRORS'
    }
}


export const successErrors = (success) => {
    return {
        type: 'SUCCESS',
        payload: success
    }
}