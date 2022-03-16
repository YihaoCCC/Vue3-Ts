import { createRouter, createWebHashHistory, Router } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[]= [
    {
        path: '/',
        redirect: '/home',
        component: () => import('../pages/dashboard/dashboard.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('../pages/home/home.vue')
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('../pages/profile/profile.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/login/login.vue')
    },
    {
        path: '/:pathMatch(.*)',
        name: 'notFound',  
        component: () => import('../pages/notFound/404.vue')
    }
   
    
]
const router:Router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router