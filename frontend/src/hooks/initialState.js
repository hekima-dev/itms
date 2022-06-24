/* application initial state */

const initialState = {

    /* components initial state */
    loading: false,
    disabled: false,

    /* user initial state */
    authenticated: false,
    username: '',
    usernameError: '',
    password: '',
    passwordError: '',
    account: '',
    accountError: ''

}

/* export initial state for global accessibility */
export default initialState