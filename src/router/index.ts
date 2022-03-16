import { createRouter, createWebHashHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[]= [
    {
        path: '/',
        redirect: '/home',
        component: () => import('../pages/dashboard/dashboard.vue'),
        children: [
            {
                path: '/home',
                component: () => import('../pages/home/home.vue')
            },
            {
                path: '/profile',
                component: () => import('../pages/profile/profile.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../pages/login/login.vue')
    }
   
    
]
const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router