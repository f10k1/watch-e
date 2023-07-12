<template>
    <v-layout>
        <v-app-bar :elevation="2">
            <v-app-bar-nav-icon class="d-block d-md-none"></v-app-bar-nav-icon>
            <NuxtLink to="/" class="ml-10">
                <v-app-bar-title>
                    WATCH-E
                </v-app-bar-title>
            </NuxtLink>
            <v-spacer></v-spacer>
            <NuxtLink to="/login">
                <v-btn prepend-icon="mdi-login">
                    Sign in
                </v-btn>
            </NuxtLink>
        </v-app-bar>
        <v-main>
            <slot></slot>
        </v-main>
        <v-footer app absolute>
            <v-container>
                <v-row justify="center" no-gutters>
                    <v-col class="text-center mt-4" cols="12">
                        <strong>Watch-e</strong>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </v-layout>
</template>