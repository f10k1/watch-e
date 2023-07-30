import User from "~/../../types/user";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const config = useRuntimeConfig();

    const res = await $fetch<User>(`${config.api_url}/auth/login`, {
        "method": "POST", body: body
    }).catch(error => error.data);

    if (!res.token) {
        setResponseStatus(event, res.statusCode ?? 401);
        return res;
    }

    setCookie(event, "auth", res.token, { maxAge: 60 * 60 * 24, path: "/" });
    return res;

});