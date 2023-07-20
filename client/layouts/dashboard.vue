<script lang="ts" setup>
import { useStore } from '@/store';

const store = useStore();
</script>

<template>
    <v-layout>
        <v-navigation-drawer expand-on-hover rail>
            <v-list>
                <v-list-item prepend-avatar="" :title="store.userinfo.value.username ?? ''"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <slot></slot>
        </v-main>
    </v-layout>
</template>