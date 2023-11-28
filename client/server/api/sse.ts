import { hooks } from "../utils/hooks";
import { WebSocket } from 'ws';

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

    // Enable SSE endpoint
    setHeader(event, 'cache-control', 'no-cache');
    setHeader(event, 'connection', 'keep-alive');
    setHeader(event, 'content-type', 'text/event-stream');
    setResponseStatus(event, 200);

    let api = new WebSocket(`${config.ws_url}/user`, { headers: { "Authorization": `Bearer ${auth}` } });

    api.addEventListener("open", () => {
        api.addEventListener("close", () => {
            event.node.res.destroy(new Error("Something went wrong"));
        });

        api.on("message", (data: any) => {
            data = JSON.parse(data.toString());
            hooks.callHook("sse:event", { event: data.type, data: data.message });
        });
    });

    let counter = 0;

    event.node.req.on("close", () => api.close())

    const sendEvent = (data: any) => {
        event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
        event.node.res.write(`id: ${++counter}\n`);
        event.node.res.flushHeaders();
    };

    hooks.hook('sse:event', sendEvent);

    // Let the connection opened
    event._handled = true;
});