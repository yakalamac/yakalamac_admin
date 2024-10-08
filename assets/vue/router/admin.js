import {createRouter, createWebHistory} from 'vue-router'
import {isAuthenticated} from "../../security/VueAuthenticator";

import Home from '../controllers/Admin/Index.vue'
import Product from "../controllers/Admin/Product.vue";
import Place from "../controllers/Admin/Place.vue";
import Bulk from "../controllers/Admin/Bulk.vue";
import Menu from '../controllers/Admin/Menu.vue'
import NotFound from "../controllers/NotFound.vue";
import TestComponent from "../controllers/TestComponent.vue";
import Login from "../controllers/Login.vue";


const router = createRouter(
    {
        history: createWebHistory(),
        routes :[
            {
                path: '/admin',
                name: 'Home',
                /** Another example usage -
                 * @example import('../controllers/Admin/Index.vue')
                 * */
                component: Home,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/list/product',
                name: 'Product',
                component: Product,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/list/place',
                name: 'Place',
                component: Place,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/operation/bulk',
                name: 'Bulk',
                component: Bulk,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/list/menu',
                name: 'Menu',
                component: Menu,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin',
                name: 'OrderHistory',
                component: null,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/admin/report',
                name: 'Report',
                component: Bulk,
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
                path: '/a',
                name: 'TestArea',
                component: TestComponent,
                meta: {
                    requiresAuth: true
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
