<script lang="ts" setup>
import type { Device } from '~/types/device';
import { useDeviceStore } from '~/store/device';
import { DeviceModalsAdd, DeviceModalsDelete, DeviceModalsEdit } from '#components';
definePageMeta(
    {
        layout: "dashboard",
        middleware: ["auth"]
    });

const devicesStore = useDeviceStore();

const checkAll: Ref<boolean> = ref(false);

const addModalRef: Ref<typeof DeviceModalsAdd | null> = ref(null);
const editModalRef: Ref<typeof DeviceModalsEdit | null> = ref(null);
const deleteModalRef: Ref<typeof DeviceModalsDelete | null> = ref(null);

const checkedIds: Ref<number[]> = ref([]);

const deviceToEdit: Ref<Device | null> = ref(null);

watch(checkAll, () => {
    if (checkAll.value) checkedIds.value = [...devicesStore.all.map((device) => device.id)]
    else checkedIds.value = []
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th>
                                <v-checkbox-btn v-model="checkAll" :value="true"></v-checkbox-btn>
                            </th>
                            <th>Name</th>
                            <th>Key</th>
                            <th></th>
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
                            <td>
                                <v-btn size="small" color="info" icon="mdi-pencil" @click="deviceToEdit = device"></v-btn>
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
    </v-container>
    <ActionButtons @add="addModalRef?.modal.toggleModal()" @delete="deleteModalRef?.modal.toggleModal()"
        :show="{ add: true, delete: true, edit: false }" :disable="{ delete: checkedIds.length === 0 }">
    </ActionButtons>
    <DeviceModalsAdd ref="addModalRef" :devices="devicesStore.all" />
    <DeviceModalsDelete ref="deleteModalRef" @removed="checkedIds = []" :devices="checkedIds" />
    <DeviceModalsEdit v-if="deviceToEdit" ref="editModalRef" :device="deviceToEdit" @reset="deviceToEdit = null" />
</template>

<style lang="scss"></style>