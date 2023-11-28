<script lang="ts" setup>

const show: Ref<boolean> = ref(false);
const props = defineProps(['disable', 'show']);

const emits = defineEmits(['add', 'edit', 'delete']);
</script>

<template>
    <div class="actions">
        <v-slide-y-reverse-transition>
            <v-list class="actions__list" v-if="show">
                <v-list-item v-if="props.show?.add">
                    <v-btn size="large" color="success" icon="mdi-plus" @click="emits('add')"
                        :disabled="props.disable?.add"></v-btn>
                </v-list-item>
                <v-list-item v-if="props.show?.delete">
                    <v-btn size="large" color="error" icon="mdi-trash-can" @click="emits('delete')"
                        :disabled="props.disable?.delete"></v-btn>
                </v-list-item>
                <v-list-item v-if="props.show?.edit">
                    <v-btn size="large" color="info" icon="mdi-pencil" @click="emits('edit')"
                        :disabled="props.disable?.edit"></v-btn>
                </v-list-item>
            </v-list>
        </v-slide-y-reverse-transition>

        <v-btn size="x-large" color="secondary" icon="mdi-cog" @click="show = !show"></v-btn>
    </div>
</template>

<style lang="scss">
.actions {
    position: fixed;
    bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
    flex-direction: column;
    right: 20px;

    &__list {
        background-color: transparent;

        .v-list-item {
            padding-inline-start: 0 !important;
            padding-inline-end: 0 !important;
        }
    }
}
</style>