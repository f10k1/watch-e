<script lang="ts" setup>
import { useStore } from "@/store";

const store = useStore();
const router = useRouter();

store.fetchUserData();

</script>


<template>
    <NuxtLayout :name="store.auth && 'dashboard'">
        <NuxtPage />
    </NuxtLayout>
</template>