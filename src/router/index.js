import {createRouter, createWebHashHistory} from 'vue-router'
import Dashboard from "@/views/Dashboard";

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
        meta: {
            login: true
        }
    }, {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
            login: true,
            reqAdmin: true,
            reqManager: true,
            reqEmployee: true
        }
    }, {
        path: '/bestellungen',
        name: 'bestellung',
        component: () => import('../views/Order.vue'),
        meta: {
            reqAdmin: true,
            reqManager: true,
        }
    }, {
        path: '/wetter',
        name: 'wetter',
        component: () => import('../views/Weather.vue'),
        meta: {
            reqAdmin: true,
            reqManager: true,
            reqEmployee: true
        }
    }, {
        path: '/bestand',
        name: 'bestand',
        component: () => import('../views/Tires.vue'),
        meta: {
            reqAdmin: true,
            reqManager: true
        }
    }, {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue'),
        meta: {
            reqAdmin: true,
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (to.meta.reqAdmin) {
        if (localStorage.getItem("role") !== "Admin") {
            next({
                name: 'login'
            });
        } else {
            next()
        }
    } else if (to.meta.reqManager) {
        if (localStorage.getItem("role") !== "Manager") {
            next({
                name: 'login'
            });
        } else {
            next()
        }
    } else if (to.meta.reqEmployee) {
        if (localStorage.getItem("role") !== "Employee") {
            next({
                name: 'login'
            });
        } else {
            next()
        }
    }else if (to.meta.login) {
        if (localStorage.getItem("role") === null) {
            next({
                name: 'login'
            });
        } else {
            next()
        }
    } else {
        next();
    }
});

export default router
