<script lang="ts" setup>
import { useStore } from "@/store";

const store = useStore();

if (useCookie("auth") && useCookie("auth").value) await store.fetchUserData();

const layout = ref(store.auth ? 'dashboard' :'default');
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