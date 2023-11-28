<script lang="ts" setup>
import { useNotificationStore } from '~/store/notification';
import { Bar } from 'vue-chartjs';
import { useDeviceStore } from '~/store/device';

definePageMeta({
    layout: "dashboard",
    middleware: ["auth"]
});

const devicesStore = useDeviceStore();

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
                    <v-col lg="12" class="pa-5">
                        <v-card>
                            <v-card-item>
                                <v-card-title>
                                    <h4 class="text-h5">Devices</h4>
                                </v-card-title>
                            </v-card-item>
                            <v-card-text>
                                <v-table v-if="devicesStore.all.length > 0">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th class="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="device in devicesStore.limited(3)" :key="device.id">
                                            <td>{{ device.name }}</td>
                                            <td class="text-center">
                                                <v-badge inline :color="device.accessible ? 'success' : 'error'"></v-badge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                                <span v-else>No devices to show</span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" lg="4" class="pa-5">
                <v-card class="notifications">
                    <v-card-item>
                        <v-card-title>
                            <h4 class="text-h5">Notifications</h4>
                        </v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <template v-if="notificationsStore.all.length > 0">
                            <Notification v-for="notification in notificationsStore.all" :key="notification.id"
                                :notification="notification" :interactive="true"></Notification>
                        </template>
                        <span v-else>No notificaitons</span>
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