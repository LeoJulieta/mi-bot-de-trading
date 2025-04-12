const fs = require('fs');
const axios = require('axios');

// CONFIGURACIÓN
const simbolo = 'USDTBRL';
const intervalo = '1m';
const dias = 30;
const montoInicial = 5;
let balance = montoInicial;
let historialInversiones = [];

// MÉTRICAS
let totalOperaciones = 0;
let ganadas = 0;
let perdidas = 0;
let rachaPerdidas = 0;
let maxRachaPerdidas = 0;
let ciclosMartingala = 0;
let perdidasConsecutivas = 0;

// Archivo para dataset
const archivoDataset = 'dataset_operaciones.csv';
if (!fs.existsSync(archivoDataset)) {
  fs.writeFileSync(archivoDataset, 'fecha,velas_rojas,velas_verdes,martingala,monto,result\n');
}

// Simulación de detección de patrón
function detectarPatron(velas) {
  let rojas = 0, verdes = 0;
  for (let i = velas.length - 10; i < velas.length; i++) {
    const vela = velas[i];
    if (vela.close < vela.open) rojas++;
    else verdes++;
  }
  return { valido: (rojas >= 6 && verdes >= 2), rojas, verdes };
}

function simularOperacion(patron, monto, multiplicadorMartingala) {
  const exito = Math.random() < 0.25;
  const resultado = exito ? monto * 0.8 : -monto;
  return { resultado, exito };
}

async function obtenerVelas() {
  const fin = Date.now();
  const inicio = fin - dias * 24 * 60 * 60 * 1000;
  const url = `https://api.binance.com/api/v3/klines?symbol=${simbolo}&interval=${intervalo}&startTime=${inicio}&endTime=${fin}`;
  const respuesta = await axios.get(url);
  return respuesta.data.map(k => ({
    openTime: k[0], open: parseFloat(k[1]), high: parseFloat(k[2]),
    low: parseFloat(k[3]), close: parseFloat(k[4]), closeTime: k[6]
  }));
}

function guardarOperacion(fecha, rojas, verdes, martingala, monto, resultado) {
  const fila = `${fecha},${rojas},${verdes},${martingala ? 1 : 0},${monto},${resultado ? 1 : 0}\n`;
  fs.appendFileSync(archivoDataset, fila);
}

async function main() {
  const velas = await obtenerVelas();
  const multiplicador = 2;
  let monto = montoInicial;
  let martingalaActiva = false;

  for (let i = 20; i < velas.length; i++) {
    const patron = detectarPatron(velas.slice(i - 10, i));

    if (patron.valido) {
      const { resultado, exito } = simularOperacion(patron, monto, multiplicador);

      balance += resultado;
      totalOperaciones++;
      martingalaActiva = !exito;

      if (exito) {
        ganadas++;
        rachaPerdidas = 0;
        monto = montoInicial;
      } else {
        perdidas++;
        rachaPerdidas++;
        monto *= multiplicador;
        ciclosMartingala++;
      }

      maxRachaPerdidas = Math.max(maxRachaPerdidas, rachaPerdidas);
      guardarOperacion(new Date(velas[i].openTime).toISOString(), patron.rojas, patron.verdes, martingalaActiva, monto, exito);
    }
  }

  console.log('--- ENTRENAMIENTO COMPLETADO ---');
  console.log(`Total operaciones: ${totalOperaciones}`);
  console.log(`Ganadas: ${ganadas}`);
  console.log(`Perdidas: ${perdidas}`);
  console.log(`Racha de pérdidas actual: ${rachaPerdidas}`);
  console.log(`Máxima racha de pérdidas: ${maxRachaPerdidas}`);
  console.log(`Ciclos de martingala: ${ciclosMartingala}`);
  console.log(`Balance final: ${balance.toFixed(2)} USDT`);
}

main();
