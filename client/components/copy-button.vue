<script setup lang="ts">
import { useAlertStore } from '~/store/alert';


const props = defineProps(['text']);

const alertStore = useAlertStore();

const copy = async () => {
    try {
        await navigator.clipboard.writeText(props.text);
        alertStore.addAlert("Copied to clipboard")
    } catch ($e) {
        alertStore.addAlert("Cannot copy to clipboard")
    }
}

</script>

<template>
    <v-btn class="ml-auto" icon="mdi-content-copy" size="small" elevation="0" @click="copy"></v-btn>
</template>