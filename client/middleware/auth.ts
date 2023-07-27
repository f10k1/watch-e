export default defineNuxtRouteMiddleware((to, from) => {

    const auth = useCookie("auth").value;

    if (!auth) return navigateTo("/");

});