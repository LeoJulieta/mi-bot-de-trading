// descargarVelas.js
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const symbol = 'USDTBRL';
const interval = '1m';
const limit = 1000; // máximo permitido por Binance
const dias = 120;
const totalMinutos = dias * 24 * 60;
const totalBloques = Math.ceil(totalMinutos / limit);
const outputPath = path.join(__dirname, 'datos', 'velas.json');

if (!fs.existsSync('datos')) fs.mkdirSync('datos');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCandles(startTime) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&startTime=${startTime}`;
  const response = await axios.get(url);
  return response.data;
}

(async () => {
  console.log(`Descargando ${dias} días de velas de 1m desde Binance...`);
  let todasLasVelas = [];
  let ahora = Date.now();
  let minuto = 60000;
  let startTime = ahora - (totalMinutos * minuto);

  for (let i = 0; i < totalBloques; i++) {
    try {
      const velas = await fetchCandles(startTime);
      if (velas.length === 0) break;

      todasLasVelas.push(...velas.map(v => ({
        time: v[0],
        open: parseFloat(v[1]),
        high: parseFloat(v[2]),
        low: parseFloat(v[3]),
        close: parseFloat(v[4]),
        volume: parseFloat(v[5])
      })));

      startTime = velas[velas.length - 1][0] + minuto;
      process.stdout.write(`Bloque ${i + 1}/${totalBloques} descargado\r`);
      await sleep(300); // pequeña pausa para evitar bloqueos
    } catch (err) {
      console.error("Error al descargar velas:", err.message);
      break;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(todasLasVelas, null, 2));
  console.log(`\nDescarga completada. Velas guardadas en: ${outputPath}`);
})();
