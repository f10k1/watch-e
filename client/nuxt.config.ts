// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '~/assets/app.scss'],
    build: {
        transpile: ['vuetify']
    },
    modules: [
        '@pinia/nuxt'
    ],
    runtimeConfig: {
        api_url: process.env.API_URL
    }
});
