const fs = require('fs');

const archivo = './datos/velas.json';

// Leer las velas existentes
let velas = JSON.parse(fs.readFileSync(archivo, 'utf8'));

// Convertir todos los timestamps a formato ISO si es necesario
velas = velas.map(v => {
  if (!v.time && v.timestamp) {
    return {
      time: new Date(v.timestamp).toISOString(),
      open: v.open,
      close: v.close,
      high: v.high,
      low: v.low,
      volume: v.volume
    };
  }
  return v;
});

// Crear 10 nuevas velas (1 por minuto después de la última)
const ultima = velas[velas.length - 1];
const ultimaFecha = new Date(ultima.time);
const nuevas = [];

for (let i = 1; i <= 10; i++) {
  const nuevaFecha = new Date(ultimaFecha.getTime() + i * 60000); // +1 minuto
  nuevas.push({
    time: nuevaFecha.toISOString(),
    open: 1,
    close: 1.01,
    high: 1.02,
    low: 0.99,
    volume: 1000 + i
  });
}

// Combinar y guardar
const actualizado = [...velas, ...nuevas];
fs.writeFileSync(archivo, JSON.stringify(actualizado, null, 2));

console.log('Velas actualizadas correctamente.');
