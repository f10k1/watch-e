import { ServerEvent } from 'composables/use-sse';
import { defineStore } from 'pinia';
import { useStore } from '~/store';
import { Notification } from '~/types/notification';
import { useAlertStore } from '~/store/alert';
import { useCustomFetch } from '~/composables/use-custom-fetch';

export const useNotificationStore = defineStore('notification', () => {

    const alertStore = useAlertStore();
    const store = useStore();

    const notifications: Ref<Notification[]> = ref([]);
    const updateNotificationsEvent: Ref<ServerEvent> = ref({
        event: "notification",
        callback: ({ data }) => {
            notifications.value.push(data);
        }
    });

    const count = computed(() => notifications.value.reduce((curr, notification) => {
        return notification.seen ? curr : curr + 1;
    }, 0));
    const all = computed(() => notifications.value);
    const unseen = computed(() => notifications.value.filter((notification) => !notification.seen));
    const filtered = computed(() => (from?: Date, to?: Date, movement?: boolean, device?: number) => {
        return notifications.value.filter((notification) => {
            if (from !== null) {
                notification;
            }
        });
    });

    const init = async () => {
        try {
            const { data } = await useCustomFetch<Notification[]>("/api/notification", { method: "GET" });

            if (data) {
                notifications.value = data;
            }
        }
        catch (err: any) {
            alertStore.addAlert(err.message);
        }

        useSSE("/api/sse", [updateNotificationsEvent.value]);
    };

    const remove = async (id: number) => {
        const index = notifications.value.findIndex((notification: Notification): boolean => notification.id === id);

        if (index === -1) return;

        try {
            const { error } = await useCustomFetch<null>(`/api/notification/${notifications.value[index].id}`, { method: "DELETE" });

            if (!error) notifications.value.splice(index, 1);

        } catch (err: any) {
            alertStore.addAlert(err.message);
        }
    };

    const markAsSeen = async (id: number) => {
        const index = notifications.value.findIndex((notification: Notification): boolean => notification.id === id);

        if (index === -1) return;

        try {
            const { error } = await useCustomFetch<null>(`/api/notification/${notifications.value[index].id}`, { method: "PATCH" });

            if (!error) notifications.value[index].seen = true;

        } catch (err: any) {
            alertStore.addAlert(err.message);
        }
    };

    return {
        count,
        all,
        unseen,
        init,
        remove,
        markAsSeen
    };
});