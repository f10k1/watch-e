import { useAlertStore } from "~/store/alert";

export default defineNuxtPlugin({
    hooks: {
        "app:created": () => {
            if (!process.client) return;

            const alertStore = useAlertStore();
            window.addEventListener("offline", () => {
                alertStore.addAlert("You are offline. Check your internet connection.");
            });
        }
    }
});