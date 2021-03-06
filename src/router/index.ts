import { createRouter, createWebHashHistory, Router } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[]= [
    {
        path: '/',
        redirect: '/login',
        component: () => import('../pages/dashboard/dashboard.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('../pages/home/home.vue'),
                meta: {
                    label: '系统主页'
                }
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
                path: '/awardApprove',
                name: 'awardApprove',
                component: () => import('../pages/award/awardApprove.vue')
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
                path: '/leaveRequest',
                name: 'leaveRequest',
                component: () => import('../pages/leave/leaveRequest.vue')
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
                path: '/compute',
                name: 'compute',
                component: () => import('../pages/money/compute.vue')
            },
             {
                 path: '/signRecord',
                 name: 'signRecord',
                 component: () => import('../pages/attendance/signRecord.vue')
             },
             {
                path: '/attendanceType',
                name: 'attendanceType',
                component: () => import('../pages/attendance/attendanceType.vue')
            },
            {
                path: '/attendanceTime',
                name: 'attendanceTime',
                component: () => import('../pages/attendance/attendanceTime.vue')
            },
            {
                path: '/task',
                name: 'task',
                component: () => import('../pages/task/task.vue')
            },
            {
                path: '/taskSubmit',
                name: 'taskSubmit',
                component: () => import('../pages/task/taskSubmit.vue')
            },
            {
                path: '/workout',
                name: 'workout',
                component: () => import('../pages/workout/workout.vue')
            },
            { 
                path: '/workoutRequest',
                name: 'workoutRequest',
                component: () => import('../pages/workout/workoutRequest.vue')  
            },
            {
                path: '/stats',
                name: 'stats',
                component: () => import('../pages/stats/stats.vue')
            },
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



router.beforeEach((to,from,next) => {
    const token = localStorage.getItem('token')
    const menu = JSON.parse(localStorage.getItem('MENU') || "[]")
    if(to.name !== 'login') {
        if(token) {
            if(to.name === 'home'){
                next()
            }else if(to.name === 'department' && menu.indexOf("DEPARTMENT") != -1){
                next()
            }else if(to.name === 'position' && menu.indexOf("POSITION") != -1){
                next()
            }else if(to.name === 'user' && menu.indexOf("USER") != -1){
                next()
            }else if(to.name === 'recordAward' && menu.indexOf("JIANGCHENG_RECORD") != -1){
                next()
            }else if(to.name === 'awardApprove' && menu.indexOf("JIANGCHENG_APPROVE") != -1){
                next()
            }else if(to.name === 'institution' && menu.indexOf("JIANGCHENG_SYSTEM") != -1){
                next()
            }else if(to.name === 'leave' && menu.indexOf("LEAVE_RECORD") != -1){
                next()
            }else if(to.name === 'leaveRequest' && menu.indexOf("LEAVE_APPROVE") != -1){
                next()
            }else if(to.name === 'workout' && menu.indexOf("TRAVEL_RECORD") != -1){
                next()
            }else if(to.name === 'workoutRequest' && menu.indexOf("TRAVEL_APPROVE") != -1){
                next()
            }else if(to.name === 'message' && menu.indexOf("MESSAGE") != -1){
                next()
            }else if(to.name === 'moneyRecord' && menu.indexOf("SALARY_RECORD") != -1){
                next()
            }else if(to.name === 'moneyInstitution' && menu.indexOf("SALARY_SYSTEM") != -1){
                next()
            }else if(to.name === 'compute' && menu.indexOf("SALARY_COMPUTE") != -1){
                next()
            }else if(to.name === 'signRecord' && menu.indexOf("SIGN_RECORD") != -1){
                next()
            }else if(to.name === 'attendanceType' && menu.indexOf("SIGN_TYPE") != -1){
                next()
            }else if(to.name === 'attendanceTime' && menu.indexOf("SIGN_TIME") != -1){
                next()
            }else if(to.name === 'task' && menu.indexOf("TASK_RECORD") != -1){
                next()
            }else if(to.name === 'taskSubmit' && menu.indexOf("TASK_SUBMIT") != -1){
                next()
            }else if(to.name === 'stats' && menu.indexOf("TASK_SUBMIT") != -1){
                next()
            }else {
                next(from.path)
            }
        } else {         
            next('/login')
        }
    }else{
        if(token){
            next('/home')
        }else{
            next()
        }
    }
})

export default router