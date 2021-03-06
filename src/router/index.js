import {createRouter, createWebHashHistory} from 'vue-router'
import store from '../store'

const routes = [
    {
        path: '/',
        redirect: {
            name: 'Login'
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role !== '') {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/bestellungen',
        name: 'Bestellung',
        component: () => import('@/views/Order'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role === "Admin" || role === "Manager" || role === "Employee") {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/wetter',
        name: 'Wetter',
        component: () => import('@/views/Weather'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role !== '') {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/statistik',
        name: 'Statistik',
        component: () => import('@/views/Statistic'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role !== '') {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/bestand',
        name: 'Bestand',
        component: () => import('@/views/Tires'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role === "Admin" || role === "Manager") {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login')
    }, {
        path: '/profil',
        name: 'Profil',
        component: () => import('../views/Profile.vue'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role !== '') {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/Admin'),
        beforeEnter: (to, from, next) => {
            const role = store.state.user.userRole
            if (role === "Admin") {
                next()
            } else {
                next(false)
            }
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
