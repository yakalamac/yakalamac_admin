import { createRouter, createWebHistory } from 'vue-router'
import Home from '../controllers/Index.vue'
import Product from "../controllers/Product.vue";
import Place from "../controllers/Place.vue";
import Bulk from "../controllers/Bulk.vue";
import Menu from '../controllers/Menu.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/list/product',
        name: 'Product',
        component: Product
    },
    {
        path: '/list/place',
        name: 'Place',
        component: Place
    },
    {
        path: '/operation/bulk',
        name: 'Bulk',
        component: Bulk
    },
    {
        path: '/list/menu',
        name: 'Menu',
        component: Menu
    },
    {
        path: '/',
        name: 'OrderHistory',
        component: null
    },
    {
        path: '/report',
        name: 'Report',
        component: null
    },
    {
        path: '/place/:id',
        name: 'PlaceDetail',
        component: null
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
