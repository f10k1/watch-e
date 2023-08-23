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
                console.log(data);
            }
        },
        cameraInaccessible: {
            name: "inaccessible",
            callback: (data: number) => {
                console.log(data);
            }
        }
    });

    const all = computed(() => cameras.value);

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

        useSocket("/notification", [events.cameraAccessible, events.cameraInaccessible]);
    };

    const remove = async (id: number) => {
        const index = cameras.value.findIndex((camera: Camera): boolean => camera.id === id);

        if (index === -1) return;

        try {
            const { error } = await useCustomFetch<null>(`/api/notification/${cameras.value[index].id}`, { method: "DELETE" });

            if (!error) cameras.value.splice(index, 1);

        } catch (err: any) {
            alertStore.addAlert(err.message);
        }
    };

    const add = async (name: string): Promise<Camera | null> => {
        try {
            const { data } = await useCustomFetch<Camera>(`/api/notification`, { method: "POST" });

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
        init,
        remove,
        add
    };
});