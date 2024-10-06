import { registerVueControllerComponents } from '@symfony/ux-vue';
import { createApp } from 'vue';
import App from './vue/App.vue';
import router from './vue/router/admin';
import './bootstrap.js';

/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css'; //Bu kısım vue controllerdan sonra etkisizleşti o yüzden App.vue da bir daha importladım

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

createApp(App).use(router).mount('#app');

// Eski symfony
registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/));
