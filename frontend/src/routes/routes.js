/* require modules */
import { lazy } from 'react'

/* create an array fo routes to various pages */
const routes = [

    /* user routes */
    {
        name: 'login',
        path: '/',
        guest: true,
        component: lazy(() => import('../pages/user/login'))
    },
    {
        name: 'user_form',
        path: '/user-form',
        guest: false,
        component: lazy(() => import('../pages/user/userForm'))
    },
    {
        name: 'edit_profile',
        path: '/edit-profile',
        guest: false,
        component: lazy(() => import('../pages/user/userForm'))
    },
    {
        name: 'user_list',
        path: '/users',
        guest: false,
        component: lazy(() => import('../pages/user/users'))
    },
    {
        name: 'change_password',
        path: '/change-password',
        guest: false,
        component: lazy(() => import('../pages/user/changePassword'))
    },


    /* role rotes */
    {
        name: 'role_list',
        path: '/roles',
        guest: false,
        component: lazy(() => import('../pages/role/roles'))
    },
    {
        name: 'role_form',
        path: '/role-form',
        guest: false,
        component: lazy(() => import('../pages/role/roleForm'))
    }

]

/* export routes for global accessibility */
export default routes