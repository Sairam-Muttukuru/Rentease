require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./app");
const initRentScheduler = require("./services/payment/RentScheduler");
const http = require("http");
const socketService = require("./services/common/SocketService");

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.console.log("Server is running");
})
// Initialize Socket.io
socketService.init(server);

server.listen(5000, () => {
    console.log("Server running on port 5000 with WebSockets");
    // Start Cron Jobs
    initRentScheduler();
});
