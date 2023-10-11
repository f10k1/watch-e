<script lang="ts" setup>
const props = defineProps(['stream']);

const activeFrame: Ref<number> = ref(0);
const stopped: Ref<boolean> = ref(true);

const interval: Ref<ReturnType<typeof setInterval> | undefined> = ref();

const play = () => {
    if (props.stream.length > activeFrame.value - 1) activeFrame.value += 1;
};

const togglePlay = () => {
    if (stopped.value) {
        interval.value = setInterval(play, 100);
        stopped.value = false;
        return;
    }

    stopped.value = true;
    window.clearInterval(interval.value)
}

togglePlay()
</script>

<template>
    <img :src="`data:image/png;base64,${props.stream[activeFrame]}`" @click="togglePlay" alt="">
</template>