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

    
]

/* export routes for global accessibility */
export default routes