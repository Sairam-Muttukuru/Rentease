const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'error_logs.txt');

module.exports = (data, context) => {
    const timestamp = new Date().toISOString();
    let message = "";

    if (data instanceof Error) {
        message = `[${timestamp}] ERROR | CONTEXT: ${context}\nMESSAGE: ${data.message}\nSTACK: ${data.stack}\n---\n`;
    } else {
        message = `[${timestamp}] DEBUG | CONTEXT: ${context}\nVALUE: ${JSON.stringify(data, null, 2)}\n---\n`;
    }

    fs.appendFileSync(logPath, message);
    console.log(`[LOGGED] ${context}`);
};
