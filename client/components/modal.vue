<script setup lang="ts">
const show: Ref<boolean> = ref(false);

const emits = defineEmits(['hide']);

const toggleModal = () => show.value = !show.value;

watch(show, () => {
    if (!show.value) emits("hide");
})

defineExpose({
    toggleModal
})

</script>

<template>
    <v-dialog v-model="show" width="500">
        <v-card>
            <v-card-title>
                <slot name="title"></slot>
            </v-card-title>
            <v-card-text>
                <slot name="content"></slot>
            </v-card-text>
            <v-card-actions>
                <slot name="buttons"></slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>