import { defineStore } from 'pinia';
import { useStore } from '~/store';
import { Device } from '~/types/device';
import { useAlertStore } from '~/store/alert';
import { useCustomFetch } from '~/composables/use-custom-fetch';

export const useDeviceStore = defineStore('device', () => {

    const alertStore = useAlertStore();
    const store = useStore();

    const devices: Ref<Device[]> = ref([]);

    const events = reactive({
        deviceAccessible: {
            name: "accessible",
            callback: (data: number) => {
                const index = devices.value.findIndex((device) => device.id === data);
                if (index === -1) return;

                devices.value[index].accessible = true;
            }
        },
        deviceInaccessible: {
            name: "inaccessible",
            callback: (data: number) => {
                const index = devices.value.findIndex((device) => device.id === data);
                if (index === -1) return;

                devices.value[index].accessible = false;
            }
        },
        devicesActive: {
            name: "availables",
            callback: (data: number[]) => {
                devices.value.forEach((device) => {
                    if (data.includes(device.id)) device.accessible = true;
                });
            }
        },
        frameRec: {
            name: "movement",
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

        useSocket("/device", [events.deviceAccessible, events.deviceInaccessible, events.devicesActive, events.frameRec]);
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

    const add = async (name: string): Promise<Device | null> => {
        try {
            const { data } = await useCustomFetch<Device>(`/api/device`, { method: "POST", body: { name } });

            if (data) {
                devices.value.push(data);
                return data;
            }

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
        add
    };
});