const fs = require('fs');
const file = 'public/logo.svg';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/fill="#[A-Fa-f0-9]{3,6}"/g, 'fill="#ffffff"');
fs.writeFileSync(file, content);
console.log("Logo updated to white");
