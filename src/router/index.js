import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard";
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },{
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
    },{
        path: '/bestellungen',
        name: 'Bestellungen',
        component: () => import('../views/Order.vue')
    },{
        path: '/wetter',
        name: 'Wetter',
        component: () => import('../views/Weather.vue')
    },{
        path: '/bestand',
        name: 'Bestand',
        component: () => import('../views/Tires.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
