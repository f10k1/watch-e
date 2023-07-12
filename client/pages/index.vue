<template>
    <section class="header pt-16">
        <v-row no-gutters>
            <v-col cols="0" lg="4"></v-col>
            <v-col cols="4" class="d-flex flex-column justify-center align-center">
                <h1 class="text-h3 text-center">Join and start living more safely with real-time monitoring.</h1>
                <NuxtLink to="/" class="my-10">
                    About me
                </NuxtLink>
                <NuxtLink to="/register">
                    <v-btn class="mt-10" size="large" variant="outlined">Sign Up</v-btn>
                </NuxtLink>
            </v-col>
            <v-col cols="0" lg="4"></v-col>
        </v-row>
    </section>
    <v-container>
        <v-row no-gutters>
            <v-col cols="0" lg="4"></v-col>
            <v-col cols="4"></v-col>
            <v-col cols="0" lg="4"></v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss">
.header {
    width: 100%;
    padding: 150px;
    background: url("assets/images/home-bg.jpg");

    h1 {
        letter-spacing: 4px !important;
    }
}
</style>