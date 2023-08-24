import { defineStore } from 'pinia';
import { useStore } from '~/store';
import { Camera } from '~/types/camera';
import { useAlertStore } from '~/store/alert';
import { useCustomFetch } from '~/composables/use-custom-fetch';

export const useCameraStore = defineStore('camera', () => {

    const alertStore = useAlertStore();
    const store = useStore();

    const cameras: Ref<Camera[]> = ref([]);

    const events = reactive({
        cameraAccessible: {
            name: "accessible",
            callback: (data: number) => {
                const index = cameras.value.findIndex((camera) => camera.id === data);
                if (index === -1) return;

                cameras.value[index].accessible = true;
            }
        },
        cameraInaccessible: {
            name: "inaccessible",
            callback: (data: number) => {
                const index = cameras.value.findIndex((camera) => camera.id === data);
                if (index === -1) return;

                cameras.value[index].accessible = false;
            }
        },
        camerasActive: {
            name: "availables",
            callback: (data: number[]) => {
                cameras.value.forEach((camera) => {
                    if (data.includes(camera.id)) camera.accessible = true;
                });
            }
        }
    });

    const all = computed(() => cameras.value);

    const limited = computed(() => (limit: number) => cameras.value.slice(0, limit));

    const init = async () => {
        try {
            const { data } = await useCustomFetch<Camera[]>("/api/camera", { method: "GET" });

            if (data) {
                cameras.value = data;
            }
        }
        catch (err: any) {
            alertStore.addAlert(err.message);
        }

        useSocket("/camera", [events.cameraAccessible, events.cameraInaccessible, events.camerasActive]);
    };

    const remove = async (cameraIds: number[]): Promise<boolean> => {
        try {
            const { error } = await useCustomFetch<null>(`/api/camera/`, { method: "DELETE", body: { targets: cameraIds } });
            if (!error) cameras.value = cameras.value.filter((camera) => !cameraIds.includes(camera.id));

            return true;
        } catch (err: any) {
            alertStore.addAlert(err.message);
            return false;
        }
    };

    const add = async (name: string): Promise<Camera | null> => {
        try {
            const { data } = await useCustomFetch<Camera>(`/api/camera`, { method: "POST", body: { name } });

            if (data) {
                cameras.value.push(data);
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