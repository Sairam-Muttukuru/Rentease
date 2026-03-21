
const fs = require('fs');
const buffer = fs.readFileSync('build_error.txt');
const content = buffer.toString('utf16le');
console.log(content);
