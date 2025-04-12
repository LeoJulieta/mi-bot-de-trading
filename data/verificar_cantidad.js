const fs = require('fs');

const data = JSON.parse(fs.readFileSync('historical.json', 'utf8'));
console.log(`Cantidad de velas: ${data.length}`);
