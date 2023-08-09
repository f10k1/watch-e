import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.provide("socket", io);
});