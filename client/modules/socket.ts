import { Server } from 'socket.io';
import ioClient from 'socket.io-client';
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule((options, nuxt) => {

    nuxt.hook('listen', (server) => {

        const io = new Server(server);
        const { api_url } = nuxt.options.runtimeConfig;

        nuxt.hook('close', () => io.close());

        io.of('notification').on('connect', (socket) => {
            const { authorization } = socket.client.request.headers;

            if (!authorization || !authorization.startsWith("Bearer ")) {
                socket.emit("unauthorized");
                socket.disconnect(true);
                return;
            }

            const api = ioClient(`${api_url}/notification`, { extraHeaders: { authorization } }).connect();

            api.on("connect", () => {
                api.on("disconnect", () => {
                    socket.disconnect();
                });

                api.on("notification", (data) => {
                    socket.emit("notification", data);
                });
            });

            socket.on("disconnect", () => {
                api.disconnect();
            });
        });

        io.of('camera').on('connect', (socket) => {
            const { authorization } = socket.client.request.headers;

            if (!authorization || !authorization.startsWith("Bearer ")) {
                socket.emit("unauthorized");
                socket.disconnect(true);
                return;
            }

            const api = ioClient(`${api_url}/camera`, { extraHeaders: { authorization } }).connect();

            api.on("connect", () => {
                api.on("disconnect", () => {
                    socket.disconnect();
                });

                api.on("availables", (data) => {
                    socket.emit("availables", data);
                });

                api.on("accessible", (data) => {
                    socket.emit("accessible", data);
                });

                api.on("inaccessible", (data) => {
                    socket.emit("inaccessible", data);
                });
            });

            socket.on("disconnect", () => {
                api.disconnect();
            });
        });
    });
});