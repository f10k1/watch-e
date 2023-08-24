<script lang="ts" setup>
import { useNotificationStore } from '~/store/notification';
import { Bar } from 'vue-chartjs';
import { useCameraStore } from '~/store/camera';

definePageMeta({
    middleware: ["auth"]
});

const camerasStore = useCameraStore();

const notificationsStore = useNotificationStore();
</script>

<template>
    <v-container>
        <v-row no-gutters justify="space-evenly">
            <v-col cols="12" lg="7">
                <v-row no-gutters>
                    <v-col cols="12" class="pa-5">
                        <v-card>
                            <v-card-item>
                                <v-card-title>
                                    <h4 class="text-h5">Last month</h4>
                                </v-card-title>
                            </v-card-item>
                            <v-card-text>
                                <!-- <chart-line :data="{}" /> -->
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col lg="6" class="pa-5">
                        <v-card>
                            <v-card-item>
                                <v-card-title>
                                    <h4 class="text-h5">Cameras</h4>
                                </v-card-title>
                            </v-card-item>
                            <v-card-text>
                                <v-table v-if="camerasStore.all.length > 0">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th class="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="camera in camerasStore.limited(3)" :key="camera.id">
                                            <td>{{ camera.name }}</td>
                                            <td class="text-center">
                                                <v-badge inline :color="camera.accessible ? 'success' : 'error'"></v-badge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                                <span v-else>No cameras to show</span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col lg="6" class="pa-5">
                        <v-card class="h-100">
                            <v-card-item>
                                <v-card-title>
                                    <h4 class="text-h5">Files</h4>
                                </v-card-title>
                            </v-card-item>
                            <v-card-text>
                                <v-table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th class="text-center">Camera</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Drzwi.mp4</td>
                                            <td class="text-center">
                                                Drzwi
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col class="pa-5">
                        <v-card>
                            <v-card-item>
                                <v-card-title>
                                    <h4 class="text-h5">Preview</h4>
                                </v-card-title>
                            </v-card-item>
                            <v-card-text>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" lg="4" md="5" class="pa-5">
                <v-card class="notifications">
                    <v-card-item>
                        <v-card-title>
                            <h4 class="text-h5">Notifications</h4>
                        </v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <Notification v-for="notification in notificationsStore.all" :key="notification.id"
                            :notification="notification" :interactive="true"></Notification>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped>
.notifications {
    position: sticky;
    top: 36px;
    max-height: calc(100vh - 72px);
    overflow: auto;
}
</style>