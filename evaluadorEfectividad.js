const fs = require("fs");

// Cargar la memoria con datos de patrones
const memoria = JSON.parse(fs.readFileSync("memoria.json", "utf8"));

// Suponiendo que agregaste en memoria también los resultados de efectividad por patrón
// Si aún no lo hiciste, este script funcionará igual comparando volumen vs resultado general

// Simulación de efectividad (esto se puede reemplazar con tus datos reales de ganancia por patrón)
const efectividadesSimuladas = {
  doji: 0.76,
  martillo: 0.63,
  "4_rojas_y_una_verde": 0.58,
  envolvente_bajista: 0.52,
  envolvente_alcista: 0.49,
  estrella_fugaz: 0.55,
};

// Armar ranking
const ranking = Object.keys(memoria)
  .map((patron) => {
    const cantidad = memoria[patron];
    const efectividad = efectividadesSimuladas[patron] || 0;
    return {
      patrón: patron,
      cantidad,
      efectividad,
      score: cantidad * efectividad,
    };
  })
  .sort((a, b) => b.score - a.score);

// Mostrar ranking
console.log("Ranking de patrones por efectividad y frecuencia:");
console.table(
  ranking.map((p) => ({
    Patrón: p.patrón,
    Ocurrencias: p.cantidad,
    Efectividad: `${(p.efectividad * 100).toFixed(2)} %`,
    Score: p.score.toFixed(2),
  }))
);
