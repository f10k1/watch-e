import { defineStore } from 'pinia';
import { useStore } from '~/store';
import type { Device } from '~/types/device';
import { useAlertStore } from '~/store/alert';
import { useCustomFetch } from '~/composables/use-custom-fetch';

export const useDeviceStore = defineStore('device', () => {

    const alertStore = useAlertStore();
    const store = useStore();

    const devices: Ref<Device[]> = ref([]);

    const events = reactive({
        deviceAccessible: {
            event: "accessible",
            callback: ({ data }: { data: number; }) => {
                const index = devices.value.findIndex((device) => device.id === data);
                if (index === -1) return;

                devices.value[index].accessible = true;
            }
        },
        deviceInaccessible: {
            event: "inaccessible",
            callback: ({ data }: { data: number; }) => {
                const index = devices.value.findIndex((device) => device.id === data);
                if (index === -1) return;

                devices.value[index].accessible = false;
            }
        },
        devicesActive: {
            event: "availables",
            callback: ({ data }: { data: number[]; }) => {
                devices.value.forEach((device) => {
                    if (data.includes(device.id)) device.accessible = true;
                });
            }
        },
        frameRec: {
            event: "movement",
            callback: () => {
            }
        }
    });

    const all = computed(() => devices.value);

    const limited = computed(() => (limit: number) => devices.value.slice(0, limit));

    const init = async () => {
        try {
            const { data } = await useCustomFetch<Device[]>("/api/device", { method: "GET" });

            if (data) {
                devices.value = data;
            }
        }
        catch (err: any) {
            alertStore.addAlert(err.message);
        }

        useSSE("/api/sse", [events.deviceAccessible, events.deviceInaccessible, events.devicesActive, events.frameRec]);
    };

    const remove = async (deviceIds: number[]): Promise<boolean> => {
        try {
            const { error } = await useCustomFetch<null>(`/api/device/`, { method: "DELETE", body: { targets: deviceIds } });
            if (!error) devices.value = devices.value.filter((device) => !deviceIds.includes(device.id));

            return true;
        } catch (err: any) {
            alertStore.addAlert(err.message);
            return false;
        }
    };

    const add = async (device: Omit<Device, "id" | "key">): Promise<Device | null> => {
        try {
            const { data } = await useCustomFetch<Device>(`/api/device`, { method: "POST", body: { ...device } });

            if (data) {
                devices.value.push(JSON.parse(JSON.stringify(data)));

                return JSON.parse(JSON.stringify(data));
            }

        } catch (err: any) {
            alertStore.addAlert(err.message);
        }

        return null;
    };

    const change = async (changes: Omit<Device, "key">): Promise<Device | null> => {
        try {
            await useCustomFetch<Device>(`/api/device`, { method: "PATCH", body: { ...changes } });

            const index = devices.value.findIndex(device => changes.id == device.id);

            if (index === -1) return null;

            devices.value[index] = {
                ...devices.value[index],
                ...changes
            };

        } catch (err: any) {
            alertStore.addAlert(err.message);
        }

        return null;
    };

    return {
        all,
        limited,
        init,
        remove,
        add,
        change
    };
});