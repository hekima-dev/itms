import { io } from "socket.io-client";
import { serverUrl } from "../helpers";

/* application initial state */

const initialState = {

    /* components initial state */
    loading: false,
    disabled: false,
    socket: io(serverUrl),

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
    branchError: '',

    /* temperature initial state */
    temperature: [],

    /* report initial state */
    startDate: '',
    startDateError: '',
    endDate: '',
    endDateError: '',

}

/* export initial state for global accessibility */
export default initialState