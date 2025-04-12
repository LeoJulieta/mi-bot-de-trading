// tools/ls-scan.js

const fs = require('fs');
const path = require('path');

const MAX_BYTES = 500; // bytes máximos que leerá de cada archivo para evitar archivos grandes
const carpetaBase = path.resolve(__dirname, '..');
const resumen = [];

function escanearDirectorio(dir, base = '') {
  const archivos = fs.readdirSync(dir);
  for (let archivo of archivos) {
    const rutaCompleta = path.join(dir, archivo);
    const rutaRelativa = path.join(base, archivo);
    const stats = fs.statSync(rutaCompleta);

    if (stats.isDirectory()) {
      resumen.push({ tipo: 'carpeta', ruta: rutaRelativa });
      escanearDirectorio(rutaCompleta, rutaRelativa);
    } else {
      const extension = path.extname(archivo);
      let contenido = '';
      try {
        const buffer = fs.readFileSync(rutaCompleta);
        contenido = buffer.toString('utf8', 0, MAX_BYTES).replace(/\s+/g, ' ').trim();
      } catch (err) {
        contenido = 'Error al leer';
      }

      resumen.push({
        tipo: 'archivo',
        ruta: rutaRelativa,
        extension,
        tamaño: stats.size,
        vistaPrevia: contenido.slice(0, 200)
      });
    }
  }
}

function guardarResumen() {
  const logDir = path.join(carpetaBase, 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const jsonPath = path.join(logDir, 'ls-scan.json');
  fs.writeFileSync(jsonPath, JSON.stringify(resumen, null, 2));
  console.log(`✅ Inventario guardado en logs/ls-scan.json`);

  // También se guarda en formato input para compartir conmigo
  const inputPath = path.join(logDir, 'input_para_chatgpt.json');
  const resumenLigero = resumen.map(item => ({
    tipo: item.tipo,
    ruta: item.ruta,
    ...(item.tipo === 'archivo' && {
      vistaPrevia: item.vistaPrevia
    })
  }));
  fs.writeFileSync(inputPath, JSON.stringify(resumenLigero, null, 2));
  console.log(`🧠 Resumen listo para ChatGPT en logs/input_para_chatgpt.json`);
}

function iniciar() {
  console.log('🗂 Escaneando estructura del proyecto...');
  escanearDirectorio(carpetaBase);
  guardarResumen();
}

iniciar();
