// bot-inteligente.js

const fs = require('fs'); const indicadores = require('./indicadores'); const patrones = require('./patrones'); const memoria = require('./memoria.json'); const datos = require('./datos.json');

let capitalInicial = 350; let capital = capitalInicial; let resultados = [];

let configuraciones = [ { nombre: 'basico', usarIndicadores: false, usarMartingale: false }, { nombre: 'conIndicadores', usarIndicadores: true, usarMartingale: false }, { nombre: 'conMartingale', usarIndicadores: false, usarMartingale: true }, { nombre: 'full', usarIndicadores: true, usarMartingale: true } ];

function simular(config) { let cap = capitalInicial; let entradas = 0; let ganadas = 0; let perdidas = 0;

for (let vela of datos) { const señales = patrones.detectar(vela); if (señales.length === 0) continue;

if (config.usarIndicadores && !indicadores.confirmaEntrada(vela)) continue;

entradas++;
const resultado = patrones.simularResultado(vela); // true = ganó

if (resultado) {
  ganadas++;
  cap += 1;
} else {
  perdidas++;
  cap -= 1;
  if (config.usarMartingale) {
    // Martingale suave: próxima apuesta x2
    cap -= 1; // pérdida extra para simular próxima entrada más fuerte
  }
}

}

return { configuracion: config.nombre, entradas, ganadas, perdidas, capitalFinal: cap, roi: ((cap - capitalInicial) / capitalInicial * 100).toFixed(2) + '%' }; }

for (let config of configuraciones) { const resultado = simular(config); resultados.push(resultado); }

console.log('\n--- COMPARATIVA DE CONFIGURACIONES ---'); for (let r of resultados) { console.log(\n[${r.configuracion}]); console.log(Entradas: ${r.entradas}); console.log(Ganadas: ${r.ganadas}); console.log(Perdidas: ${r.perdidas}); console.log(Capital final: ${r.capitalFinal} USDT); console.log(ROI: ${r.roi}); }

// Guardar resumen en archivo para análisis futuro ds = new Date().toISOString().slice(0, 10); fs.writeFileSync(./resultados/backtest-${ds}.json, JSON.stringify(resultados, null, 2));

