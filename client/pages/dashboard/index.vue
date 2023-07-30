<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"]
});
</script>

<template>
    <v-container>
        <v-row no-gutters justify="space-evenly">
            <v-col cols="12" lg="6">
                <v-row no-gutters>
                    <v-col cols="12" class="pa-5">
                        <h4 class="text-h5">Charts</h4>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col lg="5" class="pa-5">
                        <h4 class="text-h5">Cameras</h4>
                    </v-col>
                    <v-col lg="5" class="pa-5">
                        <h4 class="text-h5">Files</h4>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col class="pa-5">
                        <h4 class="text-h5">Preview</h4>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" lg="4" class="pa-5">
                <h4 class="text-h5">Notifications</h4>
            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped></style>