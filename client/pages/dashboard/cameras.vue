<script lang="ts" setup>
import { Camera } from 'types/camera';
import { useCameraStore } from '~/store/camera';

interface Modals {
    add: {
        show: boolean,
        data: Partial<Camera>;
    },
    delete: boolean,
    edit: boolean;
}

definePageMeta({
    middleware: ["auth"]
});

const rules = ref([required]);

const modals: Modals = reactive({
    add: {
        show: false,
        data: { name: '' }
    },
    delete: false,
    edit: false
});;

const add = async () => {
    if (modals.add.data.name === undefined) return;
    const data = await camerasStore.add(modals.add.data.name);

    if (data === null) return;

    modals.add.data = data;
};

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
                            <v-checkbox></v-checkbox>
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
    <ActionButtons @add="modals.add.show = true"></ActionButtons>
    <v-dialog v-model="modals.add.show" width="500">
        <v-card>
            <v-card-title>
                Dodaj nową kamerę
            </v-card-title>
            <v-card-text>
                <v-text-field label="Name" :rules="rules" v-model="modals.add.data.name"
                    variant="underlined"></v-text-field>
                <v-text-field label="Key" disabled variant="underlined"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn :disabled="!!modals.add.data.id">Add</v-btn>
                <v-btn @click="modals.add.show = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="scss"></style>