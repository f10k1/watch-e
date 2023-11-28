// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '~/assets/app.scss'],
    ssr: true,
    build: {
        transpile: ['vuetify']
    },
    modules: [
        '@pinia/nuxt',
    ],
    app: {
        head: {
            link: [{
                rel: 'manifest',
                href: '/manifest.json'
            }]
        }
    },
    runtimeConfig: {
        api_url: process.env.API_URL,
        ws_url: process.env.WS_URL
    }
});
