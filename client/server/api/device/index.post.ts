export default defineEventHandler(async (event) => {
    const { auth } = parseCookies(event);

    if (!auth) {
        setCookie(event, "auth", "");
        setResponseStatus(event, 401);
        return {
            message: {
                "auth": "No auth token"
            }
        };
    }

    const config = useRuntimeConfig();

    const body = await readBody(event);

    const res = await $fetch<Notification[]>(`${config.api_url}/device`, {
        method: "POST",
        headers: {
            authorization: "Bearer " + auth
        },
        body
    }).catch(error => error.data);

    if (res.message) {
        setResponseStatus(event, res.statusCode ?? 401);
        return res;
    }

    return res;
});