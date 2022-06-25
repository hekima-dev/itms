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


    /* role rotes */
    {
        name: 'role_list',
        path: '/roles',
        guest: false,
        component: lazy(() => import('../pages/role/roles'))
    },
    {
        name: 'create_role',
        path: '/role-form',
        guest: false,
        component: lazy(() => import('../pages/role/roleForm'))
    }

]

/* export routes for global accessibility */
export default routes