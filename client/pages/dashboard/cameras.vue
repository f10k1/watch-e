<script lang="ts" setup>
import { Camera } from 'types/camera';
import { useCameraStore } from '~/store/camera';

interface Modals {
    [key: string]: {
        show: boolean,
        loading: boolean,
        sent: boolean,
        error: boolean,
        camera?: Partial<Camera>,
    };
}

definePageMeta({
    middleware: ["auth"]
});

const rules = ref([required]);

const modals: Modals = reactive({
    add: {
        show: false,
        loading: false,
        sent: false,
        error: false,
        camera: { name: '' }
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
        loading: false
    }
});

const checked: Ref<number[]> = ref([]);

const add = async () => {
    if (modals.add.camera?.name === undefined) return;

    modals.add.loading = true;

    const data = await camerasStore.add(modals.add.camera.name);

    modals.add.loading = false;

    if (data === null) return;

    modals.add.camera = { ...data };
};

const remove = async () => {
    modals.delete.sent = true;

    if (checked.value.length === 0) {
        return;
    }

    modals.delete.error = !(await camerasStore.remove(checked.value));

    checked.value = [];
};

watch(() => modals.add.show, () => {
    modals.add = {
        ...modals.add,
        error: false,
        sent: false,
        loading: false,
        camera: { name: '' }
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

const camerasStore = useCameraStore();
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
                        <tr v-for="camera in camerasStore.all" :key="camera.id" v-if="camerasStore.all.length > 0">
                            <td><v-checkbox-btn v-model="checked" :value="camera.id"></v-checkbox-btn></td>
                            <td>{{ camera.name }}</td>
                            <td>{{ camera.key }}</td>
                            <td class="text-center">
                                <v-badge inline :color="camera.accessible ? 'success' : 'error'"></v-badge>
                            </td>
                        </tr>
                        <tr v-else>
                            <td></td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
    <ActionButtons @add="modals.add.show = true" @delete="modals.delete.show = true"></ActionButtons>
    <v-dialog v-model="modals.add.show" width="500">
        <v-card>
            <v-card-title>
                Add new camera
            </v-card-title>
            <v-card-text>
                <v-text-field label="Name" :rules="rules" v-model="modals.add.camera.name" variant="underlined"
                    :disabled="!!modals.add.camera.id"></v-text-field>
                <v-card title="Key" :text="modals.add.camera.key ?? ''" variant="outlined"></v-card>
            </v-card-text>
            <v-card-actions>
                <v-btn :loading="modals.add.loading"
                    :disabled="!!modals.add.camera.id || modals.add.camera.name?.length === 0" @click="add">
                    Add
                </v-btn>
                <v-btn @click="modals.add.show = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="modals.delete.show" width="500">
        <v-card>
            <v-card-text class="text-center">
                Are you sure you want remove selected cameras?
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
</template>

<style lang="scss"></style>