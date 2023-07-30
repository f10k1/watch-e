<script lang="ts" setup>
import { useStore } from '@/store';

const store = useStore();

const logout = () => {
    store.logout();
};
</script>

<template>
    <v-layout>
        <v-navigation-drawer permanent>
            <v-list>
                <v-list-item prepend-avatar="" :title="store.userinfo?.username ?? ''"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <NuxtLink to="dashboard/notifications">
                    <v-list-item prepend-icon="mdi-bell">
                        Notifications
                        <v-badge inline :content="0"></v-badge>
                    </v-list-item>
                </NuxtLink>
            </v-list>
            <v-list density="compact" nav>
                <NuxtLink to="dashboard/cameras">
                    <v-list-item prepend-icon="mdi-camera">
                        Cameras
                    </v-list-item>
                </NuxtLink>
            </v-list>
            <v-list density="compact" nav>
                <NuxtLink to="dashboard/settings">
                    <v-list-item prepend-icon="mdi-cog">
                        Settings
                    </v-list-item>
                </NuxtLink>
            </v-list>
            <v-list density="compact" nav>
                <NuxtLink to="dashboard/statistics">
                    <v-list-item prepend-icon="mdi-chart-bar">
                        Statistics
                    </v-list-item>
                </NuxtLink>
            </v-list>
            <v-list density="compact" nav>
                <NuxtLink to="dashboard/files">
                    <v-list-item prepend-icon="mdi-file">
                        Files
                    </v-list-item>
                </NuxtLink>
            </v-list>

            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block variant="outlined" @click="logout">
                        Logout
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-main>
            <slot></slot>
        </v-main>
    </v-layout>
</template>