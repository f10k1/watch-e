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
                <v-list-item prepend-avatar="" :title="store.userinfo.value.username ?? ''"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <NuxtLink to="dashboard/notifications">
                    <v-list-item prepend-icon="mdi-bell">Notifications</v-list-item>
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