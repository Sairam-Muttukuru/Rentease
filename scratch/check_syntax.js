const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\bhava\\OneDrive\\Desktop\\Final_year\\Rentease\\Rentease\\Frontend\\src\\pages\\TenantHomeServices.jsx', 'utf8');

function checkBalance(str, open, close) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === open) count++;
        if (str[i] === close) count--;
    }
    return count;
}

console.log('Divs balance:', checkBalance(content, '<div', '</div'));
console.log('Braces balance:', checkBalance(content, '{', '}'));
console.log('Parens balance:', checkBalance(content, '(', ')'));
