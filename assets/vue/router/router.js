import {createRouter, createWebHistory} from 'vue-router'
import {isAuthenticated} from "../../security/VueAuthenticator";

import NotFound from "../pages/NotFound.vue";
import Login from "../pages/Login.vue";
import Admin from "../pages/Admin.vue";
import Order from "../pages/Admin/Order.vue";
import Product from "../pages/Admin/Product.vue";
import Place from "../pages/Admin/Place.vue";
import Bulk from "../pages/Admin/Bulk.vue";

const router = createRouter(
    {
        history: createWebHistory(),
        routes :[
            {
                path: '/',
                name: 'Report',
                component: null,
                meta: {
                    requiresAuth: true
                },
                beforeEnter:(to, from, next)=>{
                    next('/admin');
                }
            },
            {
                path: '/admin',
                name: 'Home',
                /** Another example usage -
                 * @example import('../controllers/Admin/Index.vue')
                 * */
                component: Admin,
                meta: {
                    requiresAuth: true
                },
                children: [
                    {
                        path: '/admin/list/order',
                        name: 'Order',
                        component:  Order
                    },
                    {
                        path: 'product',
                        name: 'Product',
                        component:  Product
                    },
                    {
                        path: '/admin/list/place',
                        name: 'Place',
                        component: Place
                    },
                    {
                        path: '/admin/operation/bulk',
                        name: 'Bulk',
                        component: Bulk,
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
                        path: '/admin/place/:id',
                        name: 'PlaceDetail',
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
                ],
                beforeEnter: (to, from, next) =>{
                    if (!isAuthenticated()) {
                        next('/permission-denied');
                    } else {
                        next();
                    }
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

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated()) {
//         // Redirect to the login page if the route requires auth and user is not authenticated
//         next({name: 'Login'});
//     } else {
//         next(); // Allow the navigation
//     }
// });

export default router
