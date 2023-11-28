<script setup lang="ts">
import type { Device } from '~/types/device';
import { Modal } from "#components";
import type { ModalState } from '~/types/modal';
import { useDeviceStore } from '~/store/device';

const devicesStore = useDeviceStore();

const rules = ref([required]);
const device: Ref<Device> = ref({
    id: 0,
    name: '',
    key: '',
    settings: {
        active: true,
        type: "input",
        notificationOnDisconnect: false,
        notificationOnMovement: false
    }
});

const state: ModalState = reactive({
    loading: false,
    sent: false,
    error: false,
});

const resetState = () => {
    state.loading = false;
    state.error = false;
    state.sent = false;

    device.value = {
        id: 0,
        name: '',
        key: '',
        settings: {
            active: true,
            type: "input",
            notificationOnDisconnect: false,
            notificationOnMovement: false
        }
    };
};

const modal: Ref<typeof Modal | null> = ref(null);

const add = async () => {
    state.loading = true;

    const data = await devicesStore.add(device.value);

    state.loading = false;
    state.sent = true;

    if (data === null) {
        state.error = true;
        return;
    }

    device.value = data;
};

const inputDevices = computed(() => devicesStore.all.filter((device: Device) => device.settings.type = "input"));

watch(() => device.value.settings.type, () => {
    if (device.value.settings.type === "output") {
        delete device.value.settings.notificationOnMovement;
        device.value.settings.input = '';
    }
    else {
        device.value.settings.notificationOnMovement = false;
        delete device.value.settings.input;
    }
});

defineExpose({
    modal
})

</script>

<template>
    <Modal ref="modal" @hide="resetState">
        <template #title>Add new device</template>
        <template #content>
            <v-text-field label="Name" :rules="rules" v-model="device.name" variant="underlined"
                :disabled="!!device.id"></v-text-field>
            <v-switch v-model="device.settings.active" label="Set device to active mode" color="primary"
                :value="true"></v-switch>
            <v-radio-group v-model="device.settings.type" inline>
                <v-radio label="Detection device" value="input"></v-radio>
                <v-radio label="Controlled device" value="output"></v-radio>
            </v-radio-group>
            <v-autocomplete v-if="device.settings.type === 'output'" v-model="device.settings.input"
                label="Pick input device" :items="inputDevices" item-title="name" item-value="key"></v-autocomplete>
            <v-switch v-model="device.settings.notificationOnDisconnect" label="Show notification on device disconnect"
                color="primary" :value="true"></v-switch>
            <v-switch v-model="device.settings.notificationOnMovement" v-if="device.settings.type == 'input'"
                label="Show notification on device movement detect" color="primary" :value="true"></v-switch>
            <v-card variant="outlined">
                <v-card-title class="d-flex align-center">
                    Key
                    <CopyButton :text="device.key" v-if="device.key !== ''"></CopyButton>
                </v-card-title>
                <v-card-text>
                    {{ device.key ?? '' }}
                </v-card-text>
            </v-card>
        </template>
        <template #buttons>
            <v-btn :loading="state.loading" :disabled="!!device.id || device.name.length === 0" @click="add"
                :color="state.sent && !state.error && !state.loading && 'success' || state.error && 'error' || ''">
                Add
            </v-btn>
            <v-btn @click="modal?.toggleModal()">Close</v-btn>
        </template>
    </Modal>
</template>