export default defineNuxtRouteMiddleware((to, from) => {

    if (process.server) return

    const auth = useCookie("auth").value;

    if (!auth) return navigateTo("/");

});