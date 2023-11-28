<script lang="ts" setup>

import { storeToRefs } from 'pinia';
import { useAlertStore } from '~/store/alert';

const alertStore = useAlertStore();

const timeout: Ref<ReturnType<typeof setTimeout> | null> = ref(null);

const closeOnTimeout = () => {
    if (timeout.value) window.clearTimeout(timeout.value);

    if (showAlert) {
        timeout.value = setTimeout(() => nextAlert(), 10000);
    }
};

const showAlert: Ref<boolean> = ref(!!alertStore.alert);

watch(() => alertStore.alert, () => {
    if (!showAlert.value) showAlert.value = !!alertStore.alert;
});

onMounted(() => {
    closeOnTimeout();
});

const nextAlert = () => {
    alertStore.removeAlert();
    setTimeout(() => {
        showAlert.value = !!alertStore.alert;
        closeOnTimeout();
    }, 400);
}

</script>

<template>
    <v-fade-transition>
        <v-alert v-model="showAlert" @click:close="nextAlert" closable type="info" variant="tonal" location="bottom center"
            position="fixed" class="mb-6">
            {{ alertStore.alert }}
        </v-alert>
    </v-fade-transition>
</template>

<style scoped lang="scss">
.v-alert {
    text-transform: capitalize;
}
</style>