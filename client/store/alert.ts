import { defineStore } from 'pinia';

interface Messages { [key: string]: string; }

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref([]);
    const messages: Ref<Messages> = ref({});
    const validationErrors: Ref<Messages> = ref({});

    const validationError = computed(() => {
        return (input: string) => validationErrors.value[input] ?? null;
    });

    const addMessage = (message: Messages, code: number) => {
        if (code == 422) {
            validationErrors.value = message;
            return
        }

        messages.value = message;
    };

    const message = computed(() => {
        return (name: string) => messages.value[name];
    });

    return {
        validationErrors,
        validationError,
        addMessage,
        message
    };
});