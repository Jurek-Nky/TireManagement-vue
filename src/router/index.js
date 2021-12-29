import {createRouter, createWebHashHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard";
import {el} from "vuetify/lib/locale";

const routes = [
    {
        path: '/',
        redirect: {
            name: 'login'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
        beforeEnter: (to, from, next) => {
            const role = localStorage.getItem("role")
            if (role !== null) {
                next()
            } else {
                next(false)
            }
        }
    }
    , {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: (to, from, next) => {
            const role = localStorage.getItem("role")
            if (role !== null) {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/bestellungen',
        name: 'bestellung',
        component: () => import('../views/Order.vue'),
        beforeEnter: (to, from, next) => {
            const role = localStorage.getItem("role")
            if (role === "Admin" || role === "Manager") {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/wetter',
        name: 'wetter',
        component: () => import('../views/Weather.vue'),
        beforeEnter: (to, from, next) => {
            const role = localStorage.getItem("role")
            if (role !== null) {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/bestand',
        name: 'bestand',
        component: () => import('../views/Tires.vue'),
        beforeEnter: (to, from, next) => {
            const role = localStorage.getItem("role")
            if (role === "Admin" || role === "Manager") {
                next()
            } else {
                next(false)
            }
        }
    }, {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue'),
        beforeEnter: (to, from, next) => {
            const role = localStorage.getItem("role")
            if (role === "Admin") {
                next()
            } else {
                next(false)
            }
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
