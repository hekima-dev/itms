import { can } from "../helpers";

const menus = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'dashboard',
        visible: can('view_dashboard')
    },

    {
        title: 'Branches',
        path: can('list_branch') ? '/branch/list' : '/branch/form',
        icon: 'account_tree',
        visible: can('list_branch') || can('create_branch')
    },

    {
        title: 'Temperature',
        path:  '/temperature/list',
        icon: 'thermostat',
        visible: can('list_temperature')
    },

    {
        title: 'Report',
        path: '/report/form',
        icon: 'receipt',
        visible: can('create_report')
    },

    {
        title: 'Roles',
        path: can('list_role') ? '/role/list' : '/role/form',
        icon: 'task',
        visible: can('list_role') || can('create_role')
    },

    {
        title: 'Users',
        path: can('list_user') ? '/user/list' : '/user/form',
        icon: 'groups',
        visible: can('list_user') || can('create_user')
    }
]

export default menus