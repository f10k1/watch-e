import { defineStore } from 'pinia';
import { useAlertStore } from './alert';
import User from 'types/user';



export const useStore = defineStore('index', () => {

    const user: Ref<User | null> = ref(null);

    const router = useRouter();
    const alertStore = useAlertStore();

    const auth = computed(() => user.value?.token != null);
    const userinfo = computed(() => user.value);
    const token = computed(() => user.value?.token);

    const fetchUserData = async () => {
        try {
            const res = await useFetch<User>("/api/user", { method: "POST" });

            if (res.error.value && res.error.value.data) {
                user.value = null;
                alertStore.addMessage(res.error.value.data.message, res.error.value.data.statusCode);
                router.push("/");
                return;
            }

            const data = res.data.value;

            if (res.status.value == "success" && data) {
                user.value = { ...data };
                router.push("/dashboard");
            }
        } catch (err: any) {
            user.value = null;
            alertStore.addAlert(err.message);
            router.push("/");
        }
    };

    const login = async (body: any): Promise<void> => {
        try {

            alertStore.removeMessage('login');
            alertStore.clearValidationMessages();

            const res = await useFetch<User>("/api/login", {
                "method": "POST", body: body
            });

            if (res.error.value && res.error.value.data) {
                alertStore.addMessage(res.error.value.data.message, res.error.value.data.statusCode);
                return;
            }

            const data = res.data.value;

            if (res.status.value == "success" && data) {
                user.value = { ...data };
                router.push("/dashboard");
            }
        } catch (err: any) {
            alertStore.addMessage(err.message, err.error);
        }
    };

    const register = async (body: any): Promise<boolean> => {
        try {

            alertStore.removeMessage('register');
            alertStore.clearValidationMessages();

            const res = await useFetch<User>("/api/register", {
                "method": "POST", body: body
            });

            if (res.error.value && res.error.value.data) {
                alertStore.addMessage(res.error.value.data.message, res.error.value.data.statusCode);
                return false;
            }

            if (res.status.value == "success") {
                return true;
            }

            return false;
        } catch (err: any) {
            alertStore.addMessage(err.message, err.status);
            return false;
        }
    };

    const logout = () => {
        user.value = null;
        useCookie("auth").value = null;
        router.push("/");
    };

    return {
        auth,
        userinfo,
        token,
        fetchUserData,
        register,
        login,
        logout
    };
});