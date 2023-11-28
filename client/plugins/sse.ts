import { useAlertStore } from "~/store/alert";

export class SSEClient {
    private urls: Map<string, EventSource> = new Map();

    private events: {
        [url: string]: {
            [event: string]: (...args: any[]) => void;
        };
    } = {};

    constructor() { }

    alertStore = useAlertStore();

    connectToServer(url: string): EventSource {
        if (this.urls.has(url)) return <EventSource>this.urls.get(url);

        const sse = new EventSource(url);

        sse.addEventListener("error", () => {
            this.alertStore.addAlert("Something went wrong. Please try again later.");
        });

        sse.addEventListener("message", (event) => {
            const { event: eventType, data } = JSON.parse(event.data);

            this.events[url][eventType] && this.events[url][eventType](JSON.parse(JSON.stringify({ data })));
        });

        this.urls.set(url, sse);
        return sse;
    }

    addEventListener(url: string, event: string, callback: (...args: any[]) => void): void {
        if (!this.events[url]) this.events[url] = {};
        this.events[url][event] = callback;
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const client = new SSEClient();

    nuxtApp.provide("sse", client);
});