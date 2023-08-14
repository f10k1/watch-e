import { UseFetchOptions } from "nuxt/app";
import { useStore } from "~/store";
import { useAlertStore } from "~/store/alert";

export const useCustomFetch = async<T>(url: string, options: UseFetchOptions<any>): Promise<{ data: T[] | null, error: any; }> => {

    const store = useStore();
    const alertStore = useAlertStore();

    const res = await useFetch<T[]>(url, options);

    const error = res.error.value;

    if (error && error.data) {
        if (error.data.statusCode === 401) {
            alertStore.addAlert("Your session expired.");
            store.logout();
        }
        else {
            alertStore.addMessage(error.data.message, error.data.statusCode);
        }
        return { data: null, error };
    }

    const data = res.data.value;

    return { data, error: null };
};