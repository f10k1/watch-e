import { SSEClient } from "plugins/sse";

declare module '#app' {
    interface NuxtApp {
        $sse: SSEClient;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $sse: SSEClient;
    }
}

export { };