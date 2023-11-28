<script setup lang="ts">
import type { Device } from '~/types/device';
import { Modal } from "#components";
import type { ModalState } from '~/types/modal';
import { useDeviceStore } from '~/store/device';
const props = defineProps(['device']);
const emits = defineEmits(['reset']);

const devicesStore = useDeviceStore();

const changedValues: Ref<Device> = ref(JSON.parse(JSON.stringify(props.device ?? {})));

const rules = ref([required]);
const modal: Ref<typeof Modal | null> = ref(null);

const state: ModalState = reactive({
    loading: false,
    sent: false,
    error: false,
});

const save = async (device: Device) => {
    state.sent = true;
    state.loading = true;

    state.error = !(await devicesStore.change(changedValues.value));

    state.loading = false;
};


const inputDevices = computed(() => devicesStore.all.filter((device: Device) => device.settings.type = "input"));

watch(() => changedValues.value.settings.type, () => {
    if (changedValues.value.settings.type === "output") delete changedValues.value.settings.notificationOnMovement;
    else changedValues.value.settings.notificationOnMovement = false;
});

onMounted(() => {
    modal.value?.toggleModal();
});
</script>

<template>
    <Modal ref="modal" @hide="() => emits('reset')">
        <template #title>Edit {{ device.name }}</template>
        <template #content>
            <v-text-field :label="`New name`" :rules="rules" variant="underlined" v-model="changedValues.name"
                disabled></v-text-field>
            <v-switch v-model="changedValues.settings.active" label="Set device to active mode" color="primary"
                :value="true"></v-switch>
            <v-radio-group v-model="changedValues.settings.type" inline>
                <v-radio label="Detection device" value="input" disabled></v-radio>
                <v-radio label="Controlled device" value="output" disabled></v-radio>
            </v-radio-group>
            <v-autocomplete v-if="changedValues.settings.type === 'output'" v-model="changedValues.settings.input"
                label="Pick input device" :items="inputDevices" item-title="name" item-value="key"></v-autocomplete>
            <v-switch v-model="changedValues.settings.notificationOnDisconnect"
                label="Show notification on device disconnect" color="primary" :value="true"></v-switch>
            <v-switch v-model="changedValues.settings.notificationOnMovement"
                v-if="changedValues?.settings?.type == 'input'" label="Show notification on device movement detect"
                color="primary" :value="true"></v-switch>
        </template>
        <template #buttons>
            <v-spacer></v-spacer>
            <v-btn :loading="state.loading" @click="save"
                :color="state.sent && !state.error && !state.loading && 'success' || state.error && 'error' || ''">
                Save
            </v-btn>
            <v-btn @click="modal?.toggleModal()">Close</v-btn>
            <v-spacer></v-spacer>
        </template>
    </Modal>
</template>