<script lang="ts" setup>
import { useNotificationStore } from '~/store/notification';

definePageMeta({
    middleware: ["auth"]
});

const notificationsStore = useNotificationStore();
</script>

<template>
    <v-container>
        <v-row no-gutters justify="space-evenly">
            <v-col cols="12" lg="6">
                <v-row no-gutters>
                    <v-col cols="12" class="pa-5">
                        <h4 class="text-h5">Charts</h4>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col lg="5" class="pa-5">
                        <h4 class="text-h5">Cameras</h4>
                    </v-col>
                    <v-col lg="5" class="pa-5">
                        <h4 class="text-h5">Files</h4>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col class="pa-5">
                        <h4 class="text-h5">Preview</h4>
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

.notifications {
    position: sticky;
    top: 36px;
    max-height: calc(100vh - 72px);
    overflow: auto;
}
</style>