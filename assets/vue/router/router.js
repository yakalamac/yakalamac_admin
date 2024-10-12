import {createRouter, createWebHistory} from 'vue-router'
import {isAuthenticated} from "../../security/VueAuthenticator";

import NotFound from "../pages/NotFound.vue";
import Login from "../pages/Login.vue";
import Admin from "../pages/Admin.vue";

const router = createRouter(
    {
        history: createWebHistory(),
        routes :[
            {
                path: '/',
                name: 'Home',
                /** Another example usage -
                 * @example import('../controllers/Admin/Index.vue')
                 * */
                component: Admin,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/list/product',
                name: 'Product',
                component: NotFound,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/list/place',
                name: 'Place',
                component: NotFound,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/operation/bulk',
                name: 'Bulk',
                component: NotFound,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/list/menu',
                name: 'Menu',
                component: NotFound,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/order/history',
                name: 'OrderHistory',
                component: null,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/report',
                name: 'Report',
                component: NotFound,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/place/:id',
                name: 'PlaceDetail',
                component: null,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/:pathMatch(.*)*', // Tüm eşleşmeyen yolları yakala
                name: 'NotFound',
                component: NotFound,
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: '/login',
                name: 'Login',
                component: Login,
                meta: {
                    requiresAuth: false,
                }
            },
            {
                path: '/cover/password',
                name: 'CoverPassword',
                component: Login,
                meta: {
                    requiresAuth: false,
                }
            },
            {
                path: '/register',
                name: 'Register',
                component: Login,
                meta: {
                    requiresAuth: false,
                }
            }
        ]
    });

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated()) {
        // Redirect to the login page if the route requires auth and user is not authenticated
        next({name: 'Login'});
    } else {
        next(); // Allow the navigation
    }
});

export default router
