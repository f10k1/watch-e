import { WebSocket } from "ws";

export interface WebSocketEntity<T> extends WebSocket {
    entity: T,
}