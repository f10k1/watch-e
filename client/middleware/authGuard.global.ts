export default defineNuxtRouteMiddleware((to, from) => {

    const auth = useCookie("auth").value

    if (to.path === "/" && auth) {
        return navigateTo('/dashboard');
    }
    else if (!auth && to.path != "/") {
        return navigateTo('/');
    }

});