// tools/Organizador.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const directorioBase = path.resolve(__dirname, '..');
const mapaCambios = {};
const rutasImportadas = [
  'resultados.json',
  'patrones.json',
  'datos_entrenamiento.json',
  'estrategias.json'
];
const carpetasObjetivo = {
  'resultados.json': 'datos',
  'patrones.json': 'datos',
  'datos_entrenamiento.json': 'datos',
  'estrategias.json': 'datos'
};
const archivosJS = [];

function escanearArchivos(dir) {
  const archivos = fs.readdirSync(dir);
  for (let archivo of archivos) {
    const rutaAbsoluta = path.join(dir, archivo);
    const stats = fs.statSync(rutaAbsoluta);
    if (stats.isDirectory()) {
      escanearArchivos(rutaAbsoluta);
    } else if (archivo.endsWith('.js')) {
      archivosJS.push(rutaAbsoluta);
    }
  }
}

function crearCarpetaSiNoExiste(carpeta, simular) {
  const ruta = path.join(directorioBase, carpeta);
  if (!fs.existsSync(ruta)) {
    if (simular) {
      console.log(`🟡 Carpeta a crear: ${carpeta}`);
    } else {
      fs.mkdirSync(ruta, { recursive: true });
      console.log(`✔ Carpeta creada: ${carpeta}`);
    }
  }
}

function moverArchivo(archivo, destino, simular) {
  const origenAbsoluto = path.join(directorioBase, archivo);
  const destinoAbsoluto = path.join(directorioBase, destino, archivo);

  if (!fs.existsSync(origenAbsoluto)) return;

  crearCarpetaSiNoExiste(destino, simular);

  if (simular) {
    console.log(`🟡 Se movería: ${archivo} → ${destino}/`);
  } else {
    fs.renameSync(origenAbsoluto, destinoAbsoluto);
    console.log(`→ Movido: ${archivo} → ${destino}/`);
    mapaCambios[archivo] = path.join(destino, archivo);
  }
}

function actualizarReferencias(simular) {
  for (let archivoJS of archivosJS) {
    let contenido = fs.readFileSync(archivoJS, 'utf8');
    let actualizado = false;
    let backup = contenido;

    for (let [original, nuevo] of Object.entries(mapaCambios)) {
      const rutaOriginal = `./${original}`;
      const rutaNueva = `./${nuevo}`;

      if (contenido.includes(rutaOriginal)) {
        contenido = contenido.replace(new RegExp(rutaOriginal, 'g'), rutaNueva);
        actualizado = true;
        console.log(`✏️ ${path.relative(directorioBase, archivoJS)}: reemplazar "${rutaOriginal}" por "${rutaNueva}"`);
      }
    }

    if (actualizado && !simular) {
      fs.writeFileSync(`${archivoJS}.bak`, backup); // backup
      fs.writeFileSync(archivoJS, contenido);
    }
  }
}

function guardarMapaCambios(simular) {
  const rutaLog = path.join(directorioBase, 'logs');
  if (!fs.existsSync(rutaLog)) fs.mkdirSync(rutaLog);
  const nombre = simular ? 'simulacion.json' : 'mapa_archivos.json';
  fs.writeFileSync(path.join(rutaLog, nombre), JSON.stringify(mapaCambios, null, 2));
  console.log(`📝 ${simular ? 'Simulación' : 'Mapa de cambios'} guardado en logs/${nombre}`);
}

function preguntarYNecesitaConfirmacion(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\n¿Querés ejecutar los cambios? (s/n): ', (respuesta) => {
    rl.close();
    callback(respuesta.trim().toLowerCase() === 's');
  });
}

// ---- MAIN ----

function iniciar(simular = true) {
  console.log(simular ? '--- MODO SIMULACIÓN ---' : '--- EJECUTANDO CAMBIOS ---');
  escanearArchivos(directorioBase);

  for (let archivo of rutasImportadas) {
    if (fs.existsSync(path.join(directorioBase, archivo))) {
      moverArchivo(archivo, carpetasObjetivo[archivo], simular);
    }
  }

  actualizarReferencias(simular);
  guardarMapaCambios(simular);

  if (simular) {
    preguntarYNecesitaConfirmacion((confirmado) => {
      if (confirmado) {
        console.log('\nEjecutando cambios reales...');
        iniciar(false);
      } else {
        console.log('\nCancelado. No se hicieron cambios.');
      }
    });
  } else {
    console.log('✅ Organización completa.');
  }
}

iniciar(true);
