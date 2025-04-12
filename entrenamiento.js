// entrenamiento.js
const fs = require('fs');
const path = require('path');
const {
  detectarMartillo,
  detectarDoji,
  detectarEnvolventeAlcista,
  detectarEnvolventeBajista,
  detectarEstrellaFugaz,
  detectar4RojasYUnaVerde
} = require('./patrones');
const gestorPatrones = require('./gestor_patrones'); // NUEVO

// Archivos usados
const archivoVelas = path.join(__dirname, 'datos', 'velas.json');
const archivoMemoria = path.join(__dirname, 'memoria.json');
const archivoEstadoPatrones = path.join(__dirname, 'estado_patrones.json');
const archivoResultados = path.join(__dirname, 'resultados.json');

// Carga de archivos
const velas = JSON.parse(fs.readFileSync(archivoVelas, 'utf8'));
let memoria = fs.existsSync(archivoMemoria)
  ? JSON.parse(fs.readFileSync(archivoMemoria, 'utf8'))
  : {};

let estadoPatrones = fs.existsSync(archivoEstadoPatrones)
  ? JSON.parse(fs.readFileSync(archivoEstadoPatrones, 'utf8'))
  : {};

let resultados = fs.existsSync(archivoResultados)
  ? JSON.parse(fs.readFileSync(archivoResultados, 'utf8'))
  : {};

// Función para contar aparición de patrón
function agregarPatron(nombre) {
  memoria[nombre] = (memoria[nombre] || 0) + 1;
}

// Recorrer velas y detectar patrones
for (let i = 5; i < velas.length; i++) {
  const ultimas = velas.slice(i - 5, i);
  const anterior = velas[i - 1];
  const actual   = velas[i];

  if (detectar4RojasYUnaVerde(ultimas))      agregarPatron('4_rojas_y_una_verde');
  if (detectarMartillo(actual))              agregarPatron('martillo');
  if (detectarDoji(actual))                  agregarPatron('doji');
  if (detectarEnvolventeAlcista(anterior, actual)) agregarPatron('envolvente_alcista');
  if (detectarEnvolventeBajista(anterior, actual)) agregarPatron('envolvente_bajista');
  if (detectarEstrellaFugaz(actual))         agregarPatron('estrella_fugaz');
}

// Guardar memoria
fs.writeFileSync(archivoMemoria, JSON.stringify(memoria, null, 2));

// Calcular y actualizar efectividad por patrón
for (const patron in estadoPatrones) {
  const nombreCorto = patron.replace('patron_', '').trim();
  const keyMemoria = Object.keys(memoria).find(k => k.includes(nombreCorto));

  if (keyMemoria && resultados[patron]) {
    const total = resultados[patron].aciertos + resultados[patron].errores;
    const efectividad = total > 0 ? resultados[patron].aciertos / total : 0;
    estadoPatrones[patron].efectividad = parseFloat(efectividad.toFixed(2));
  }
}

// Actualizar archivo estado_patrones.json
fs.writeFileSync(archivoEstadoPatrones, JSON.stringify(estadoPatrones, null, 2));

// Aplicar lógica de activación o suspensión automática
gestorPatrones.actualizarEstados();

console.log('Entrenamiento completado y estados de patrones actualizados.');
console.table(memoria);
