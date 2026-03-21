import { io } from "socket.io-client";
import BASE_URL from "./apiConfig";

const SOCKET_URL = BASE_URL;

let socket;

export const initSocket = (userId) => {
    if (!socket && userId) {
        socket = io(SOCKET_URL, {
            query: { userId },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket server as user:", userId);
        });

        socket.on("connect_error", (error) => {
            console.error("Connection Error:", error);
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
