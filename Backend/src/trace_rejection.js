const ServiceProviderService = require("./services/serviceProvider/ServiceProviderService");
const fs = require("fs");

async function reproduce() {
    const logFile = "reproduction_result.txt";
    const log = (msg) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + "\n");
    };
    
    // Redirect console functions
    console.log = log;
    console.error = log;
    console.warn = log;

    try {
        log("Triggering updateBookingStatus(24, 31, 'Rejected')...");
        await ServiceProviderService.updateBookingStatus(24, 31, "Rejected", "Final Trace Attempt");
        log("Reproduction call finished.");
        setTimeout(() => {
            log("DONE.");
            process.exit(0);
        }, 10000);
    } catch (err) {
        log("Reproduction Error:" + err.message);
        process.exit(1);
    }
}
reproduce();
