const fs = require('fs');
const rutaEstado = './estado_patrones.json';

function obtenerPatronesActivos() {
  const data = JSON.parse(fs.readFileSync(rutaEstado));
  return Object.entries(data)
    .filter(([_, info]) => info.estado === 'activo')
    .map(([clave, info]) => ({ clave, ...info }));
}

function actualizarEstadoPatron(clave, nuevaEfectividad, umbral = 0.6) {
  const data = JSON.parse(fs.readFileSync(rutaEstado));
  if (!data[clave]) {
    console.error(`Patrón ${clave} no encontrado`);
    return;
  }

  data[clave].efectividad = nuevaEfectividad;
  data[clave].estado = nuevaEfectividad >= umbral ? 'activo' : 'dormido';
  fs.writeFileSync(rutaEstado, JSON.stringify(data, null, 2));
  console.log(`Patrón ${clave} actualizado a ${data[clave].estado}`);
}

module.exports = {
  obtenerPatronesActivos,
  actualizarEstadoPatron
};
