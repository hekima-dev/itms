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
    oldPassword: '',
    oldPasswordError: '',
    passwordConfirmation: '',
    passwordConfirmationError: '',
    account: '',
    accountError: '',
    user: '',
    userError: '',
    phone: '',
    phoneError: '',
    users: [],

    /* role initial state */
    roleName: '',
    roleNameError: '',
    permissions: [],
    permissionsError: '',
    edit: false,
    id: '',
    roles: [],
    role: '',
    roleError: '',

    /* branch initial state */
    branchName: '',
    branchNameError: '',
    branchId: 0,
    branchIdError: '',
    branches: [],
    branch: '',
    branchError: ''
}

/* export initial state for global accessibility */
export default initialState