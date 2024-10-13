const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
/**
 Bu yapılandırma, Symfony'nin Webpack Encore kütüphanesini kullanarak Vue.js uygulamanızın derleme ayarlarını yapıyor. Ancak, Vue'da kullanılan özellik bayraklarını ayarlamak için DefinePlugin'i eklemeniz gerekiyor. Bunu yapmak için Encore yapılandırmanıza şu adımları ekleyebilirsiniz:

 1. DefinePlugin Kullanımı
 Öncelikle, Webpack'in DefinePlugin özelliğini kullanarak gerekli bayrakları tanımlayın. webpack.config.js dosyanıza aşağıdaki kodu ekleyin:
 */



// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or subdirectory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/app.js')

  //  .addEntry('$','./assets/bootstrap/assets/js/jquery.min.js')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    .enableVueLoader()

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    .enableStimulusBridge('./assets/controllers.json')

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // configure Babel
    // .configureBabel((config) => {
    //     config.plugins.push('@babel/a-babel-plugin');
    // })

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })
    // In your webpack.config.js file, enable the PostCSS Loader. See the documentation for more information.
    // @see https://symfony.com/doc/current/frontend/encore/postcss.html
    .enablePostCssLoader()

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use React
    //.enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()

    .configureDevServerOptions(options=>{
        options.hot = true;
        options.open = true;
    })

/**
 app.js:41 Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__
 are not explicitly defined. You are running the esm-bundler build of Vue,
 which expects these compile-time feature flags to be globally injected via the bundler config
 in order to get better tree-shaking in the production bundle.
 For more details, see https://link.vuejs.org/feature-flags.
 Solution is working :)

 Bu hata, Vue.js projenizin yapılandırmasında bazı özellik bayraklarının (feature flags) doğru şekilde ayarlanmadığını gösteriyor. Özellikle, esm-bundler yapılandırmasını kullanıyorsanız, bu bayrakların global olarak tanımlanması gerekiyor. Aşağıdaki adımları izleyerek bu durumu düzeltebilirsiniz:

 Vite veya Webpack Yapılandırması
 Eğer Vite veya Webpack kullanıyorsanız, yapılandırma dosyanızda define alanına bu bayrakları eklemeniz gerekiyor.

 Vite için: vite.config.js dosyanıza şunları ekleyin:
 import { defineConfig } from 'vite';
 import vue from '@vitejs/plugin-vue';

 export default defineConfig({
 plugins: [vue()],
 define: {
 __VUE_OPTIONS_API__: true, // veya false, ihtiyacınıza göre
 __VUE_PROD_DEVTOOLS__: false,
 __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
 }
 });

 Webpack için:

 webpack.config.js dosyanıza şunları ekleyin:
 */
    .addPlugin(new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true), // veya false
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
    }))
;

module.exports = Encore.getWebpackConfig();
