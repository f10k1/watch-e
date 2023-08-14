<script lang="ts" setup>
import { useNotificationStore } from '~/store/notification';

const { notification, interactive } = defineProps(['notification', 'interactive']);

const open: Ref<boolean> = ref(false);
const icons: Ref<Record<string, string>> = ref({
    warning: "mdi-alert",
    success: "mdi-check",
    error: "mdi-alert-circle",
    info: "mdi-information"
});

const notificationsStore = useNotificationStore();

const type = computed(() => notification.type.toLowerCase());

const remove = () => {
    notificationsStore.remove(notification.id);
};
if (!notification.seen) watch(open, () => {
    if (!notification.seen) notificationsStore.markAsSeen(notification.id);
});
</script>

<template>
    <div class="notification py-3 px-5 mt-2 d-flex align-center"
        :class="[`notification--${type}`, { 'notification--interactive': interactive }]"
        :style="`background-color: rgba(var(--v-theme-${type}), ${notification.seen ? .5 : 1})`" @click="open = !open">
        <v-icon class="mr-3" :icon="icons[type]"></v-icon>
        {{ notification.title }}
        <v-icon class="ml-auto" v-if="interactive" @click="remove" icon="mdi-trash-can-outline"></v-icon>
    </div>
    <v-expand-transition>
        <div v-if="open">
            <div class="notification__content pa-5"
                :style="`background-color: rgba(var(--v-theme-${type}), ${notification.seen ? .5 : 1})`">
                {{ notification.content }}
            </div>
        </div>
    </v-expand-transition>
</template>

<style scoped lang="scss">
.notification {
    &--interactive {
        transition: .3s filter;

        &:hover {
            filter: brightness(.8);
            cursor: pointer;
        }
    }

    &__content {
        filter: brightness(.9);
    }

    color: rgb(var(--v-theme-on-surface));
}
</style>