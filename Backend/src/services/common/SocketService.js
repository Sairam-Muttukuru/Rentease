const { Server } = require("socket.io");
const logger = require("../../utils/logger");

let io;
// Map to track user presence: userId -> { socketIds: Set, online: boolean }
const connectedUsers = new Map();

const init = (server) => {
    const allowedOrigins = [
        "https://rentease-rho.vercel.app",
        "https://rentease.com",
        "https://www.rentease.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ];

    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                const isAllowed = allowedOrigins.includes(origin) || origin.includes("localhost") || origin.includes("127.0.0.1");
                if (isAllowed) {
                    callback(null, true);
                } else {
                    console.warn(`CORS blocked for origin: ${origin}`);
                    callback(null, true); // Temporarily allow all for debugging heart
                }
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        
        if (userId && userId !== 'undefined') {
            try {
                socket.join(`user_${userId}`);
                
                if (!connectedUsers.has(userId)) {
                    connectedUsers.set(userId, { socketIds: new Set(), online: true });
                    io.emit("user_status_change", { userId, status: "online" });
                    logger({ userId }, "User connected (First session)");
                }
                connectedUsers.get(userId).socketIds.add(socket.id);
                logger({ userId, socketId: socket.id }, "User session added");
            } catch (err) {
                console.error("[SocketService] Connection handler error:", err.message);
            }
        }

        socket.on("disconnect", () => {
            try {
                if (userId && connectedUsers.has(userId)) {
                    const userData = connectedUsers.get(userId);
                    userData.socketIds.delete(socket.id);
                    
                    if (userData.socketIds.size === 0) {
                        connectedUsers.delete(userId);
                        io.emit("user_status_change", { userId, status: "offline" });
                        logger({ userId }, "User fully disconnected");
                    }
                }
            } catch (err) {
                console.error("[SocketService] Disconnect error:", err.message);
            }
        });

        // Handle typing events
        socket.on("typing", (data) => {
            try {
                socket.to(`user_${data.receiverId}`).emit("display_typing", {
                    senderId: userId,
                    isTyping: data.isTyping
                });
            } catch (err) {
                console.error("[SocketService] Typing event error:", err.message);
            }
        });

        socket.on("error", (err) => {
            console.error("[SocketService] Socket error:", err.message);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`user_${userId}`).emit(event, data);
    }
};

const isUserOnline = (userId) => {
    return connectedUsers.has(userId.toString());
};

module.exports = { init, getIO, emitToUser, isUserOnline };
