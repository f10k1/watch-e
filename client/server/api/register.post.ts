export default defineEventHandler(async event => {
    const body = await readBody(event);

    const config = useRuntimeConfig();

    const res = await $fetch<any>(`${config.api_url}/user/register`, {
        "method": "POST", body: body
    }).catch(error => error.data);

    console.log(res)

    if (res.statusCode) {
        setResponseStatus(event, res.statusCode);
        return res;
    }

    return res;

});