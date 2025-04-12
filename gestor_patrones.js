const fs = require('fs');

const ESTADO_PATH = './estado_patrones.json';
const UMBRAL_DORMIR = 0.5;
const UMBRAL_ACTIVAR = 0.6;

function actualizarEstados(resultados) {
  const estados = JSON.parse(fs.readFileSync(ESTADO_PATH));

  for (const patron in resultados) {
    const nuevaEfectividad = resultados[patron];

    if (!estados[patron]) {
      // Si es un patrón nuevo, se crea con descripción vacía
      estados[patron] = {
        descripcion: "Descripción pendiente",
        estado: nuevaEfectividad >= UMBRAL_DORMIR ? "activo" : "dormido",
        efectividad: nuevaEfectividad
      };
    } else {
      estados[patron].efectividad = nuevaEfectividad;

      if (nuevaEfectividad < UMBRAL_DORMIR) {
        estados[patron].estado = "dormido";
      } else if (estados[patron].estado === "dormido" && nuevaEfectividad > UMBRAL_ACTIVAR) {
        estados[patron].estado = "activo";
      }
    }
  }

  fs.writeFileSync(ESTADO_PATH, JSON.stringify(estados, null, 2));
}

module.exports = { actualizarEstados };
