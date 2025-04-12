const fs = require('fs');
const https = require('https');

const symbol = 'USDTBRL';
const interval = '1m';
const limit = 1000;

let now = Date.now();
let candles = [];
let count = 0;

function fetchCandles(startTime) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&startTime=${startTime}`;

  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      const json = JSON.parse(data);
      if (json.length === 0) {
        fs.writeFileSync('historical.json', JSON.stringify(candles, null, 2));
        console.log(`Listo! Guardadas ${candles.length} velas.`);
        return;
      }

      candles.push(...json.map(item => ({
        time: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      })));

      const nextTime = json[json.length - 1][0] + 60_000;
      count++;

      if (count < (43200 / limit)) {
        setTimeout(() => fetchCandles(nextTime), 500);
      } else {
        fs.writeFileSync('historical.json', JSON.stringify(candles, null, 2));
        console.log(`Descarga completada: ${candles.length} velas guardadas.`);
      }
    });
  });
}

// Cambiado de 15 a 30 días
const treintaDiasAtras = now - 30 * 24 * 60 * 60 * 1000;
fetchCandles(treintaDiasAtras);


fs.copyFileSync('historical.json', 'velas.json');
console.log('Archivo historical.json copiado como velas.json');
