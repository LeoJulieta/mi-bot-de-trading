const fs = require("fs");

let capital = 300;
const montoBase = 5;
let montoActual = montoBase;

const patrones = [
  "doji",
  "martillo",
  "estrella_fugaz",
  "envolvente_alcista",
  "envolvente_bajista",
  "4_rojas_y_una_verde",
  "tres_soldados_blancos",
  "cuervos_negros",
  "marubozu",
  "piercing",
  "nube_oscura",
  "harami_alcista",
  "harami_bajista"
];

// Resultados generales
let resultadosFinales = {
  operaciones: [],
  totalGanadas: 0,
  totalPerdidas: 0,
  capitalInicial: capital,
  capitalFinal: null,
  porPatron: {}
};

// Inicializar estadísticas por patrón
patrones.forEach(p => {
  resultadosFinales["porPatron"][p] = {
    total: 0,
    ganadas: 0,
    perdidas: 0
  };
});

function simularOperacion(patron) {
  const ganadora = Math.random() < 0.6; // 60% ganancia
  resultadosFinales.porPatron[patron].total++;

  if (ganadora) {
    capital += montoActual * 1.95;
    resultadosFinales.totalGanadas++;
    resultadosFinales.porPatron[patron].ganadas++;
  } else {
    capital -= montoActual;
    resultadosFinales.totalPerdidas++;
    resultadosFinales.porPatron[patron].perdidas++;
  }

  const resultado = {
    patron,
    fueGanadora: ganadora,
    monto: montoActual,
    capitalRestante: parseFloat(capital.toFixed(2)),
    fecha: new Date().toISOString()
  };

  resultadosFinales.operaciones.push(resultado);

  console.log(
    `Operación con patrón ${patron} fue ${ganadora ? "GANADORA" : "PERDEDORA"}.`
  );
  console.log(`Capital actual: ${resultado.capitalRestante} USDT.\n`);

  montoActual = ganadora ? montoBase : montoActual * 2;
}

// Simular múltiples operaciones
for (let i = 0; i < 100; i++) {
  const patron = patrones[Math.floor(Math.random() * patrones.length)];
  simularOperacion(patron);
}

resultadosFinales.capitalFinal = parseFloat(capital.toFixed(2));

// Mostrar resumen en consola
const operacionesTotales = resultadosFinales.operaciones.length;
console.log("\nResumen Final:");
console.log(`Operaciones Totales: ${operacionesTotales}`);
console.log(`Ganadoras: ${resultadosFinales.totalGanadas}`);
console.log(`Perdedoras: ${resultadosFinales.totalPerdidas}`);
console.log(`Capital final: ${capital.toFixed(2)} USDT\n`);

// Mostrar tabla resumen por patrón
let resumenPatrones = {};
for (let patron in resultadosFinales.porPatron) {
  const stats = resultadosFinales.porPatron[patron];
  resumenPatrones[patron] = `${stats.total} (${stats.ganadas} G / ${stats.perdidas} P)`;
}
console.log("Resumen por patrón:");
console.table(resumenPatrones);

// Guardar resultados
fs.writeFileSync("resultados_simulacion.json", JSON.stringify(resultadosFinales, null, 2));
console.log("Resultados guardados en resultados_simulacion.json");
