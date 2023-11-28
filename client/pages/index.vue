<script lang="ts" setup>

import { ref } from "vue";
import { useStore } from "@/store";
import { useAlertStore } from "@/store/alert";
import { required } from "@/utils/validators";

definePageMeta({
    layout: "default",
    middleware: () => {
        const auth = useCookie("auth").value;

        if (auth) return navigateTo("/dashboard");
    }
});

const store = useStore();
const alerts = useAlertStore();
const rules = ref([required]);

const showLoginForm: Ref<boolean> = ref(true);

const registerForm: Ref<any> = ref(null);
const registerValues: Ref<any> = ref({});
const register = async () => {
    const { valid } = await registerForm.value.validate();
    if (!registerForm.value || !valid) return;

    showLoginForm.value = await store.register({ ...registerValues.value });

    return;
};

const loginForm: Ref<any> = ref(null);
const loginValues: Ref<any> = ref({});
const login = async () => {
    const { valid } = await loginForm.value.validate();
    if (!loginForm.value || !valid) return;

    store.login({ ...loginValues.value });

    return;
};

</script>

<template>
    <div class="showLoginForm-page">
        <div class="img">
            <img src="~/assets/images/login-img.jpg" alt="" />
        </div>
        <div>
            <v-fade-transition>
                <v-form @submit.prevent="login" v-if="showLoginForm" ref="loginForm">
                    <h1 class="mb-10">Sign in</h1>
                    <div class="mb-5" v-if="alerts.message('auth')">{{ alerts.message('auth') }}</div>
                    <v-text-field v-model="loginValues['username']" class="mb-5" label="Username"
                        :rules="rules"></v-text-field>
                    <v-text-field v-model="loginValues['password']" class="mb-5" label="Password" type="password"
                        :rules="rules"></v-text-field>
                    <v-btn type="submit" size="large" block variant="outlined">Login</v-btn>
                    <v-divider class="my-5"></v-divider>
                    <h3 class="my-6">No account yet?</h3>
                    <v-btn size="large" block variant="outlined" @click="showLoginForm = false">Sign
                        up</v-btn>
                </v-form>
                <v-form @submit.prevent="register" v-else ref="registerForm">
                    <h1 class="mb-10">Sign up</h1>
                    <div class="mb-5" v-if="alerts.message('register')">{{ alerts.message('register') }}</div>
                    <v-text-field v-model="registerValues['username']" class="mb-4"
                        :error-messages="alerts.validationError('username') ?? []" label="Username"
                        :rules="rules"></v-text-field>
                    <v-text-field v-model="registerValues['email']" class="mb-4"
                        :error-messages="alerts.validationError('email') ?? []" label="Email" type="email"
                        :rules="rules"></v-text-field>
                    <v-text-field class="mb-4" v-model="registerValues['password']"
                        :error-messages="alerts.validationError('password') ?? []" label="Password" type="password"
                        :rules="rules"></v-text-field>
                    <v-text-field v-model="registerValues['passwordConfirm']" class="mb-4"
                        :error-messages="alerts.validationError('passwordConfirm') ?? []" label="Repeat password"
                        type="password" :rules="rules"></v-text-field>
                    <v-btn type="submit" size="large" block variant="outlined">Register</v-btn>
                    <v-divider class="my-5"></v-divider>
                    <h3 class="my-6">Do you have an account?</h3>
                    <v-btn size="large" block variant="outlined" @click="showLoginForm = true">Sign in</v-btn>
                </v-form>
            </v-fade-transition>
        </div>
    </div>
</template>

<style lang="scss">
.showLoginForm-page {
    .img {
        position: absolute;
        left: 40%;
        top: 10%;
        width: 50%;

        img {
            width: 100%;
            height: auto;
        }

    }

    form {
        position: absolute;
        left: 25%;
        top: 15%;
        width: min(50%, 600px);
        padding: 40px;
        backdrop-filter: blur(5px);
        background: rgba(0, 0, 0, 0.9);
    }

    @media screen and (max-width: 1024px) {
        .img {
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 40px);
        }

        form {
            left: 50%;
            transform: translateX(-50%);
            width: calc(50%);
        }
    }

    @media screen and (max-width: 768px) {
        .img {
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 40px);
        }

        form {
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 80px);
        }
    }
}
</style>