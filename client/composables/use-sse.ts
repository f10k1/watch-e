export interface ServerEvent {
    event: string,
    callback: (...args: any[]) => void;
}

export const useSSE = (url: string, events: ServerEvent[]) => {
    if (!process.client) return;

    const { $sse } = useNuxtApp();

    events.forEach(item => {
        $sse.addEventListener(url, item.event, item.callback);
    });

    $sse.connectToServer(url);
};
