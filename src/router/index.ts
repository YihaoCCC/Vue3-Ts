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
            },
            {
                path: '/department',
                name: 'department',
                component: () => import('../pages/department/department.vue')
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('../pages/user/user.vue')
             },
             {
                 path: '/recordAward',
                 name: 'recordAward',
                 component: () => import('../pages/award/recordAward.vue')
             },
             {
                 path: '/institution',
                 name: 'institution',
                 component: () => import('../pages/award/institution.vue')
             },
             {
                 path: '/leave',
                 name: 'leave',
                 component: () => import('../pages/leave/leave.vue')
             },
             {
                 path: '/message',
                 name: 'message',
                 component:() => import('../pages/message/message.vue')
             },
             {
                 path: '/position',
                 name: 'position',
                 component: () => import('../pages/position/position.vue')
             },
             {
                 path: '/moneyRecord',
                 name: 'moneyRecord',
                 component: ( ) => import ('../pages/money/moneyRecord.vue')
        
             },
             {
                 path: '/moneyInstitution',
                 name: 'moneyInstitution',
                 component: () => import('../pages/money/moneyInstitution.vue')
             },
             {
                 path: '/signRecord',
                 name: 'signRecord',
                 component: () => import('../pages/attendance/signRecord.vue')
             },
             {
                path: '/attendanceRecord',
                name: 'attendanceRecord',
                component: () => import('../pages/attendance/attendanceRecord.vue')
            },
            {
                path: '/attendanceInstitution',
                name: 'attendanceInstitution',
                component: () => import('../pages/attendance/attendanceInstitution.vue')
            },
            {
                path: '/task',
                name: 'task',
                component: () => import('../pages/task/task.vue')
            },
            {
                path: '/workout',
                name: 'workout',
                component: () => import('../pages/workout/workout.vue')
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