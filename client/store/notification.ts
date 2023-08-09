import { SocketEvent } from 'composables/use-socket';
import { defineStore } from 'pinia';
import { useStore } from '~/store';
import { Notification } from '~/types/notification';
import { useAlertStore } from '~/store/alert';

export const useNotificationStore = defineStore('notification', () => {

    const alertStore = useAlertStore();
    const store = useStore();

    const notifications: Ref<Notification[]> = ref([]);
    const updateNotificationsEvent: Ref<SocketEvent> = ref({
        name: "notification",
        callback: (data) => {
            notifications.value.push(data);
        }
    });

    const count = computed(() => notifications.value.reduce((curr, notification) => {
        return notification.seen ? curr : curr + 1;
    }, 0));
    const all = computed(() => notifications.value);
    const unseen = computed(() => notifications.value.filter((notification) => !notification.seen))

    const init = async () => {
        try {
            const res = await useFetch<Notification[]>("/api/notification", { method: "GET" });

            if (res.error.value && res.error.value.data) {
                if (res.error.value.data.statusCode === 401) {
                    alertStore.addAlert("Your session expired.");
                    store.logout();
                }
                else {
                    alertStore.addMessage(res.error.value.data.message, res.error.value.data.statusCode);
                }
                return;
            }

            const data = res.data.value;
            console.log(data);

            if (res.status.value == "success" && data) {
                notifications.value = data;
            }
        }
        catch (err: any) {
            alertStore.addAlert(err.message);
        }

        useSocket("/notification", [updateNotificationsEvent.value]);
    };

    return {
        count,
        all,
        unseen,
        init
    };
});