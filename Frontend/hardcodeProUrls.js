
import fs from 'fs';
import path from 'path';

const frontendSrc = 'c:\\Users\\bhava\\OneDrive\\Desktop\\Final_year\\Rentease\\Rentease\\Frontend\\src';
const PROD_URL = 'https://rentease-1-pwm5.onrender.com';

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(frontendSrc);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Hardcode every single axios-style API string to the production Render URL
    // Catch cases like '/api/...', 'api/...' and also those already starting with templates
    
    // 1. Literal strings
    const literalRegex = /(['"])(?:\/)?api\//g;
    if (literalRegex.test(content)) {
        content = content.replace(literalRegex, `$1${PROD_URL}/api/`);
        changed = true;
    }
    
    // 2. Backtick templates
    const templateRegex = /`(?:\/)?api\//g;
    if (templateRegex.test(content)) {
        content = content.replace(templateRegex, `\`${PROD_URL}/api/`);
        changed = true;
    }
    
    // 3. Prevent double production URLs if already hardcoded
    const doubleProdRegex = new RegExp(`${PROD_URL}/${PROD_URL}`, 'g');
    if (doubleProdRegex.test(content)) {
        content = content.replace(doubleProdRegex, PROD_URL);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Hardcoded URL Fix: ${file}`);
    }
});
