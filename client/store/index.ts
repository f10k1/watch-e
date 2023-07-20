import { defineStore } from 'pinia';
import { useAlertStore } from './alert';

interface User {
    token: string | null,
    username: string | null,
}

export const useStore = defineStore('index', () => {

    const user: Ref<User> = ref({
        token: null,
        username: null,
    });

    const router = useRouter();
    const alertStore = useAlertStore();

    const fetchUserData = (token?: string) => {
        if (!token && !useCookie("auth").value) {
            user.value = {
                token: null,
                username: null,
            };
            return;
        }
        useCustomFetch("auth/user", {
            method: "POST",
            body: { token: token ?? useCookie("auth").value }
        }).then(res => {
            const data = (res.data.value as any);

            if (res.status.value == "success") {
                user.value = {
                    token: token ?? useCookie("auth").value,
                    ...data
                };
            }
            else {
                const error = res.error.value?.data;
                throw new Error(error.message, { cause: error.error });
            }
        }).catch((err) => {
            user.value = {
                token: null,
                username: null,
            };
            useCookie("auth").value = null;
            alertStore.addMessage(err.message, err.error);
        });
    };

    const auth = computed(() => user.value.token != null);

    const userinfo = computed(() => user);

    const login = async (body: any): Promise<void> => {
        try {
            const res = await useCustomFetch("auth/login", {
                "method": "POST", body: body
            });
            const data = (res.data.value as any);
            const error = res.error.value?.data;
            if (res.status.value == "success") {
                if (data.token) {
                    await fetchUserData(data.token);
                    const cookie = useCookie("auth", { maxAge: 60 * 60 * 24, path: "/" });
                    cookie.value = data.token;
                    router.push("/dashboard");
                }
            }
            else {
                if (error.message) {
                    alertStore.addMessage(error.message, error.statusCode);
                }
            }
        } catch (err: any) {
            alertStore.addMessage(err.message, err.error);
        }
    };

    const register = async (body: any): Promise<boolean> => {
        try {
            const res = await useCustomFetch("user/register", {
                "method": "POST", body: body
            });
            if (res.status.value == "success") {
                return true;
            }
            else {
                const error = res.error.value?.data;
                if (error.message) {
                    alertStore.addMessage(error.message, error.statusCode);
                }
                return false;
            }
        } catch (err: any) {
            alertStore.addMessage(err.message, err.status);
            return false;
        }
    };

    return {
        auth,
        userinfo,
        fetchUserData,
        register,
        login,
    };
});