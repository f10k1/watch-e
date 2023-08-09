import { Socket } from "socket.io-client";
import { useStore } from "~/store";
import { useAlertStore } from "~/store/alert";

export interface SocketEvent {
    name: string,
    callback: (...args: any[]) => void;
}

export const useSocket = (url: string, events: SocketEvent[]) => {
    const { $socket } = useNuxtApp();

    const store = useStore();

    const alertStore = useAlertStore();

    const timeout: Ref<ReturnType<typeof setTimeout> | null> = ref(null);

    const socket: Ref<Socket | null> = ref(null);

    socket.value = $socket(url, {
        extraHeaders: {
            Authorization: "Bearer " + store.token
        }
    });

    socket.value?.on("connect", () => {
        socket.value?.on("disconnect", () => {
            if (!window.navigator.onLine) {
                alertStore.addAlert("Check your internet connection");
                window.addEventListener("online", function retrieveConnection() {
                    socket.value?.connect();
                    this.window.removeEventListener("online", retrieveConnection);
                });
            }
            else {
                alertStore.addAlert("Something went wrong. Please try again later.");
                timeout.value = setTimeout(() => {
                    socket.value?.connect();
                }, 10000);
            }
        });

        socket.value?.on("unauthorized", () => {
            alertStore.addAlert("Your session expired. Please log in again.");
            store.logout();
        });

        events.forEach(event => socket.value?.on(event.name, event.callback));
    });

    return socket;
};
