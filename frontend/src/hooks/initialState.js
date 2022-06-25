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
    accountError: '',

    /* role initial state */
    roleName: '',
    roleNameError: '',
    permissions: [],
    permissionsError: '',
    edit: false,
    id: '',
    roles: [],

}

/* export initial state for global accessibility */
export default initialState