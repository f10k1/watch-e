<script setup lang="ts">
import { Modal } from "#components";
import { useDeviceStore } from "~/store/device";
import type { ModalState } from "~/types/modal";

const props = defineProps(['devices']);

const emits = defineEmits(['reset', 'removed']);

const devicesStore = useDeviceStore();

const modal: Ref<typeof Modal | null> = ref(null);

const state: ModalState = reactive({
    loading: false,
    sent: false,
    error: false,
});

const remove = async () => {
    if (props.devices.length === 0) return;

    state.error = !(await devicesStore.remove([...props.devices]));

    state.sent = true;
    state.loading = false;

    emits('removed');
};

const resetState = () => {
    state.loading = false;
    state.error = false;
    state.sent = false;

    emits('reset');
};

defineExpose({
    modal
})

</script>

<template>
    <Modal ref="modal" @hide="() => resetState">
        <template #title>Are you sure you want remove selected devices?</template>
        <template #buttons>
            <v-spacer></v-spacer>
            <v-btn :loading="state.loading" @click="remove"
                :color="state.sent && !state.error && !state.loading && 'success' || state.error && 'error' || ''">
                Remove
            </v-btn>
            <v-btn @click="modal?.toggleModal()">Close</v-btn>
            <v-spacer></v-spacer>
        </template>
    </Modal>
</template>