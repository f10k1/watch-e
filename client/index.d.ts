import { io } from "socket.io-client";

declare module '#app' {
    interface NuxtApp {
        $socket: typeof io;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $socket: typeof io;
    }
}

export { };