import { Device } from "../../../types/device";

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

    const res = await $fetch<Device[]>(`${config.api_url}/device`, {
        headers: {
            authorization: "Bearer " + auth
        }
    }).catch(error => error.data);

    if (res.message) {
        setResponseStatus(event, res.statusCode ?? 401);
        return res;
    }

    return res;
});