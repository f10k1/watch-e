<script lang="ts" setup>
import { useStore } from "@/store";

const store = useStore();

store.fetchUserData();

const layout = ref('default');

watch(() => store.auth, () => {
    layout.value = store.auth ? 'dashboard' : 'default';
});
</script>


<template>
    <NuxtLayout :name="layout">
        <NuxtPage />
        <Alert />
    </NuxtLayout>
</template>