<script lang="ts" setup>
import { Device } from 'types/device';
import { useDeviceStore } from '~/store/device';

interface Modals {
    [key: string]: {
        show: boolean,
        loading: boolean,
        sent: boolean,
        error: boolean,
        device?: Partial<Device>,
    };
}

definePageMeta({
    middleware: ["auth"]
});

const rules = ref([required]);
const devicesStore = useDeviceStore();

const modals: Modals = reactive({
    add: {
        show: false,
        loading: false,
        sent: false,
        error: false,
        device: { name: '' }
    },
    delete: {
        show: false,
        error: false,
        sent: false,
        loading: false
    },
    edit: {
        show: false,
        error: false,
        sent: false,
        loading: false,
    }
});

const checkedIds: Ref<number[]> = ref([]);

const checkedDevices: ComputedRef<Device[]> = computed(() => devicesStore.all.filter((device) => checkedIds.value.includes(device.id)))

const add = async () => {
    if (modals.add.device?.name === undefined) return;

    modals.add.loading = true;

    const data = await devicesStore.add(modals.add.device.name);

    modals.add.loading = false;

    if (data === null) return;

    modals.add.device = { ...data };
};

const remove = async () => {
    modals.delete.sent = true;

    if (checkedIds.value.length === 0) {
        return;
    }

    modals.delete.error = !(await devicesStore.remove(checkedIds.value));

    checkedIds.value = [];
};

watch(() => modals.add.show, () => {
    modals.add = {
        ...modals.add,
        error: false,
        sent: false,
        loading: false,
        device: { name: '' }
    };
});

watch(() => modals.delete.show, () => {
    modals.delete = {
        ...modals.delete,
        error: false,
        sent: false,
        loading: false
    };
});

</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Key</th>
                            <th class="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="device in devicesStore.all" :key="device.id" v-if="devicesStore.all.length > 0">
                            <td><v-checkbox-btn v-model="checkedIds" :value="device.id"></v-checkbox-btn></td>
                            <td>{{ device.name }}</td>
                            <td class="d-flex align-center">
                                {{ device.key }}
                                <CopyButton :text="device.key"></CopyButton>
                            </td>
                            <td class="text-center">
                                <v-badge inline :color="device.accessible ? 'success' : 'error'"></v-badge>
                            </td>
                        </tr>
                        <tr v-else>
                            <td></td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <Stream v-if="devicesStore.allStreams.length" :stream="devicesStore.allStreams[0].frames"></Stream>
    </v-container>
    <ActionButtons @add="modals.add.show = true" @delete="modals.delete.show = true" @edit="modals.edit.show = true">
    </ActionButtons>
    <v-dialog v-model="modals.add.show" width="500">
        <v-card>
            <v-card-title>
                Add new device
            </v-card-title>
            <v-card-text>
                <v-text-field label="Name" :rules="rules" v-model="modals.add.device.name" variant="underlined"
                    :disabled="!!modals.add.device?.id"></v-text-field>
                <v-card  variant="outlined">
                    <v-card-title class="d-flex align-center">
                        Key
                        <CopyButton :text="modals.add.device?.key" v-if="modals.add.device?.key"></CopyButton>
                    </v-card-title>
                    <v-card-text>
                        {{ modals.add.device?.key ?? '' }}
                    </v-card-text>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-btn :loading="modals.add.loading"
                    :disabled="!!modals.add.device.id || modals.add.device.name?.length === 0" @click="add">
                    Add
                </v-btn>
                <v-btn @click="modals.add.show = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="modals.delete.show" width="500">
        <v-card>
            <v-card-text class="text-center">
                Are you sure you want remove selected devices?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading="modals.delete.loading" @click="remove"
                    :color="modals.delete.sent && !modals.delete.error && !modals.delete.loading && 'success' || modals.delete.error && 'error' || ''">
                    Remove
                </v-btn>
                <v-btn @click="modals.delete.show = false">Close</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="modals.edit.show" width="500">
        <v-card>
            <v-card-title class="text-center">
                Edit {{ checkedIds.length === 1 ? 'device' : `${checkedIds.length} devices` }}
            </v-card-title>
            <v-card-text>
                <v-text-field :label="`${device.name} new name`" :key="device.id" :rules="rules"
                    v-for="(device, index) in checkedDevices" variant="underlined"
                    v-model="checkedDevices[index].name"
                    :disabled="!!modals.add.device?.id"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading="modals.delete.loading" @click="remove"
                    :color="modals.delete.sent && !modals.delete.error && !modals.delete.loading && 'success' || modals.delete.error && 'error' || ''"
                    v-if="checkedDevices.length > 0">
                    Remove
                </v-btn>
                <v-btn @click="modals.edit.show = false">Close</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss"></style>