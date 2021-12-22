import {createRouter, createWebHistory} from 'vue-router'
import Login from '@/views/Login'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
