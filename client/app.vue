<script lang="ts" setup>
import { useStore } from "@/store";

const store = useStore();
const router = useRouter();

if (useCookie("auth") && useCookie("auth").value) await store.fetchUserData();

</script>


<template>
    <NuxtLayout>
        <NuxtPage />
        <Alert />
    </NuxtLayout>
</template>