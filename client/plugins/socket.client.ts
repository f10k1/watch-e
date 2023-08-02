import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const socket = io(`${config.api_url}`);

    nuxtApp.provide("socket", socket);
});