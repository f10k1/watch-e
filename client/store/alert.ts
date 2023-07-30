import { defineStore } from 'pinia';

interface Messages { [key: string]: string; }

export const useAlertStore = defineStore('alert', () => {
    const alerts: Ref<string[]> = ref([]);
    const messages: Ref<Messages> = ref({});
    const validationErrors: Ref<Messages> = ref({});

    const validationError = computed(() => {
        return (input: string) => validationErrors.value[input] ?? null;
    });

    const addAlert = (alert: string | string[]) => {
        if (typeof alert === "string") alerts.value.push(alert);
        else alerts.value = [...alerts.value, ...alert];
    };

    const alert = computed(() => alerts.value[0]);

    const removeAlert = () => {
        alerts.value.shift();
    };

    const addMessage = (message: Messages, code: number) => {
        if (code == 422) {
            validationErrors.value = message;
            return;
        }

        messages.value = message;
    };

    const message = computed(() => {
        return (name: string) => messages.value[name];
    });

    const removeMessage = (key: string) => {
        delete messages.value[key];
    };

    const clearValidationMessages = () => {
        validationErrors.value = {};
    };

    return {
        validationErrors,
        validationError,
        messages,
        addMessage,
        addAlert,
        removeMessage,
        clearValidationMessages,
        removeAlert,
        alert,
        message
    };
});