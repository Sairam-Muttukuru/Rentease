require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./app");
const initRentScheduler = require("./services/payment/RentScheduler");
const http = require("http");
const socketService = require("./services/common/SocketService");

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Initialize Socket.io
socketService.init(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} with WebSockets`);
    initRentScheduler();
});
