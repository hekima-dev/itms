/* require modules */
import { lazy } from 'react'

/* create an array fo routes to various pages */
const routes = [

    /* user routes */
    {
        path: '/',
        guest: true,
        component: lazy(() => import('../pages/user/login'))
    },
    {
        path: '/user/form',
        guest: false,
        component: lazy(() => import('../pages/user/form'))
    },
    {
        path: '/user/profile',
        guest: false,
        component: lazy(() => import('../pages/user/form'))
    },
    {
        path: '/user/list',
        guest: false,
        component: lazy(() => import('../pages/user/list'))
    },
    {
        path: '/user/password',
        guest: false,
        component: lazy(() => import('../pages/user/changePassword'))
    },

    /* role rotes */
    {
        path: '/role/list',
        guest: false,
        component: lazy(() => import('../pages/role/list'))
    },
    {
        path: '/role/form',
        guest: false,
        component: lazy(() => import('../pages/role/form'))
    },

    /* branch routes */
    {
        path: '/branch/form',
        guest: false,
        component: lazy(() => import('../pages/branch/form'))
    },
    {
        path: '/branch/list',
        guest: false,
        component: lazy(() => import('../pages/branch/list'))
    },

    /* temperature routes */
    {
        path: '/temperature/list',
        guest: false,
        component: lazy(() => import('../pages/temperature/list'))
    },

    /* report routes */
    {
        path: '/report/form',
        guest: false,
        component: lazy(() => import('../pages/report/form'))
    },

    /* dashboard routes */
    {
        path: '/dashboard',
        guest: false,
        component: lazy(() => import('../pages/dashboard/dashboard'))
    },

    {
        path: '*',
        guest: false,
        component: lazy(() => import('../pages/user/form'))
    },
    {
        path: '*',
        guest: true,
        component: lazy(() => import('../pages/user/login'))
    },
]

/* export routes for global accessibility */
export default routes