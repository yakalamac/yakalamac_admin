import { registerVueControllerComponents} from '@symfony/ux-vue';
import { createApp } from 'vue';
import App from './vue/App.vue';
import router from './vue/router/admin';
import './bootstrap.js';

/** Loader **/
import './bootstrap/assets/css/pace.min.css';
import './bootstrap/assets/js/pace.min.js';

/** Plugins **/
import './bootstrap/assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css';
import './bootstrap/assets/plugins/metismenu/metisMenu.min.css';
import './bootstrap/assets/plugins/metismenu/mm-vertical.css';
import './bootstrap/assets/plugins/simplebar/css/simplebar.css';

/** Bootstrap css **/
import './bootstrap/assets/css/bootstrap.min.css';

/** Main css **/
import './bootstrap/assets/css/bootstrap-extended.css';
import './bootstrap/sass/main.css';
import './bootstrap/sass/dark-theme.css';
import './bootstrap/sass/blue-theme.css';
import './bootstrap/sass/semi-dark.css';
import './bootstrap/sass/bordered-theme.css';
import './bootstrap/sass/responsive.css';
import './bootstrap/assets/css/bootstrap.min.css';
const  $ = require('jquery');
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

createApp(App).use(router).mount('#app');

// Eski symfony
registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/));


