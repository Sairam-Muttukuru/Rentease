const ServiceProviderService = require("./services/serviceProvider/ServiceProviderService");
const db = require("./config/db");

async function reproduce() {
    try {
        console.log("Reproducing rejection email trigger for booking 24 with provider userId 31...");
        // updateBookingStatus(bookingId, userId, status, rejectionReason)
        await ServiceProviderService.updateBookingStatus(24, 31, "Rejected", "Test Rejection Log - check if email triggers");
        console.log("Reproduction call finished.");
        
        setTimeout(() => {
            console.log("Exiting reproduction script.");
            process.exit(0);
        }, 10000);
    } catch (err) {
        console.error("Reproduction Error:", err);
        process.exit(1);
    }
}
reproduce();
