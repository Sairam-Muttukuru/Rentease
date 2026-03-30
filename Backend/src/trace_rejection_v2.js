const ServiceProviderService = require("./services/serviceProvider/ServiceProviderService");
const fs = require("fs");

async function reproduce() {
    const logFile = "reproduction_result.txt";
    fs.writeFileSync(logFile, "Starting logs...\n");
    const log = (msg) => {
       fs.appendFileSync(logFile, (typeof msg === 'object' ? JSON.stringify(msg) : msg) + "\n");
    };
    
    // Backup original logs
    const origLog = console.log;
    const origErr = console.error;
    
    console.log = (...args) => {
        log(args.join(' '));
        origLog.apply(console, args);
    };
    console.error = (...args) => {
        log("[ERROR] " + args.join(' '));
        origErr.apply(console, args);
    };

    try {
        log("Triggering updateBookingStatus(24, 31, 'Rejected')...");
        await ServiceProviderService.updateBookingStatus(24, 31, "Rejected", "Tracing for user");
        log("Reproduction call finished.");
        setTimeout(() => {
            log("FINISHED.");
            process.exit(0);
        }, 10000);
    } catch (err) {
        log("Reproduction Error: " + err.message);
        process.exit(1);
    }
}
reproduce();
