import User from "~/../../types/user";

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

    const res = await $fetch<User>(`${config.api_url}/auth/user`, {
        method: "POST", body: {
            token: auth
        }
    }).catch(error => error.data);

    if (!res.username) {
        setCookie(event, "auth", "");
        setResponseStatus(event, res.statusCode ?? 401);
        return res;
    }

    return res;
});