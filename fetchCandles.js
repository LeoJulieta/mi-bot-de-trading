// ~/backend/fetchCandles.js
const fs = require('fs');
const https = require('https');

const symbol = 'USDTBRL';
const interval = '1m';
const limit = 1000;
const maxCandles = 5000; // Cantidad total que querés descargar

let allCandles = [];
let startTime = Date.now() - (maxCandles * 60 * 1000); // Hace X minutos

function fetchBatch() {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&startTime=${startTime}`;

  https.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);

    res.on('end', () => {
      const raw = JSON.parse(data);

      if (raw.length === 0) {
        console.log('No se recibieron más velas.');
        saveToFile();
        return;
      }

      const candles = raw.map(kline => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));

      allCandles.push(...candles);

      console.log(`Descargadas: ${allCandles.length}`);

      if (allCandles.length >= maxCandles) {
        saveToFile();
        return;
      }

      startTime = raw[raw.length - 1][0] + 60 * 1000; // Siguiente minuto
      setTimeout(fetchBatch, 500); // Espera 0.5s por límite de Binance
    });
  }).on('error', err => {
    console.error('Error:', err.message);
  });
}

function saveToFile() {
  fs.writeFileSync('candles.json', JSON.stringify(allCandles.slice(0, maxCandles), null, 2));
  console.log(`Guardadas ${allCandles.length} velas en candles.json`);
}

fetchBatch();
