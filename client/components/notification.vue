<script lang="ts" setup>
import { Notification } from "~/types/notification";

const { notification, interactive } = defineProps(['notification', 'interactive'])

</script>

<template>
    <div v-if="interactive"></div>
    <div v-else class="notification py-3 px-10 mt-2" :class="`notification--${notification.type.toLowerCase()}`">
        {{ notification.content }}
    </div>
</template>

<style scoped lang="scss">
.notification {
    &--success {
        background-color: rgb(var(--v-theme-success));
    }
    &--info {
        background-color: rgb(var(--v-theme-info));
    }
    &--warning {
        background-color: rgb(var(--v-theme-warning));
    }
    &--error {
        background-color: rgb(var(--v-theme-error));
    }
    color: rgb(var(--v-theme-surface));
}
</style>