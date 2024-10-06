import { createRouter, createWebHistory } from 'vue-router'
import Vue from 'vue';

import Home from '../controllers/Admin/Index.vue'
import Product from "../controllers/Admin/Product.vue";
import Place from "../controllers/Admin/Place.vue";
import Bulk from "../controllers/Admin/Bulk.vue";
import Menu from '../controllers/Admin/Menu.vue'
import NotFound from "../controllers/NotFound.vue";

const routes = [
    {
        path: '/admin',
        name: 'Home',
        /** Another example usage -
         * @example import('../controllers/Admin/Index.vue')
         * */
        component: Home
    },
    {
        path: '/admin/list/product',
        name: 'Product',
        component: Product
    },
    {
        path: '/admin/list/place',
        name: 'Place',
        component: Place
    },
    {
        path: '/admin/operation/bulk',
        name: 'Bulk',
        component: Bulk
    },
    {
        path: '/admin/list/menu',
        name: 'Menu',
        component: Menu
    },
    {
        path: '/admin',
        name: 'OrderHistory',
        component: null
    },
    {
        path: '/admin/report',
        name: 'Report',
        component: null
    },
    {
        path: '/admin/place/:id',
        name: 'PlaceDetail',
        component: null
    },
    {
        path: '/admin/:pathMatch(.*)*', // Tüm eşleşmeyen yolları yakala
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    });

export default router
