import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule((options, nuxt) => {

    nuxt.hook('listen', (server) => {

        const io = new Server(server);
        const { ws_url } = nuxt.options.runtimeConfig;

        nuxt.hook('close', () => io.close());

        io.of('notification').on('connect', (socket) => {
            const { authorization } = socket.client.request.headers;

            if (!authorization || !authorization.startsWith("Bearer ")) {
                socket.emit("unauthorized");
                socket.disconnect(true);
                return;
            }

            const api = new WebSocket(`${ws_url}/notification`, { headers: { "Authorization": authorization } });

            api.addEventListener("open", () => {
                api.addEventListener("close", () => {
                    socket.disconnect();
                });

                api.on("message", (data: any) => {
                    data = JSON.parse(data.toString());
                    switch (data.type) {
                        case 'notification':
                            socket.emit("notification", data);
                            break;
                    }
                });
            });

            socket.on("disconnect", () => {
                api.close();
            });
        });

        io.of('device').on('connect', (socket) => {
            const { authorization } = socket.client.request.headers;

            if (!authorization || !authorization.startsWith("Bearer ")) {
                socket.emit("unauthorized");
                socket.disconnect(true);
                return;
            }

            const api = new WebSocket(`${ws_url}/device`, { headers: { authorization } });

            api.addEventListener("open", () => {
                api.addEventListener("close", () => {
                    socket.disconnect();
                });

                api.on("message", (data: any) => {
                    data = JSON.parse(data.toString());

                    switch (data.type) {
                        case 'availables':
                            socket.emit("availables", data.message);
                            break;
                        case 'accessible':
                            socket.emit("accessible", data.message);
                            break;
                        case 'inaccessible':
                            socket.emit("inaccessible", data.message);
                            break;
                        case 'movement':
                            socket.emit("movement", data.message);
                            break;
                    }
                });
            });

            socket.on("disconnect", () => {
                api.close();
            });
        });
    });
});