require('dotenv').config();  // Cargar las claves de la API desde el archivo .env
const Binance = require('node-binance-api');
const fs = require('fs');

// Configurar la API de Binance
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_SECRET_KEY,
});

// Función para obtener las velas hacia atrás
async function obtenerVelasHaciaAtras() {
  const symbol = 'USDTBRL';  // Par de divisas
  const interval = '1m';  // Intervalo de las velas (1 minuto)
  const limit = 1000;  // Limite de velas por petición

  // Leer las velas existentes desde el archivo datos.json
  let data = [];
  if (fs.existsSync('datos.json')) {
    data = JSON.parse(fs.readFileSync('datos.json', 'utf8'));
  }

  // Verificar si ya tenemos velas
  if (data.length === 0) {
    console.log('No se encontraron velas previas en datos.json');
    return;
  }

  // Obtener el timestamp de la primera vela en el archivo (la más antigua)
  const primeraVela = data[0];
  const startTime = primeraVela.tiempo;

  console.log(`Descargando velas desde el timestamp: ${startTime}...`);

  // Descargar las velas hacia atrás
  binance.candlesticks(symbol, interval, async (error, ticks, symbol) => {
    if (error) {
      console.error('Error al obtener velas:', error.body);
      return;
    }

    console.log(`Obteniendo velas para el par ${symbol}...`);

    // Procesar las velas descargadas
    const nuevasVelas = ticks.map(tick => ({
      tiempo: tick[0],
      apertura: tick[1],
      cierre: tick[4],
      alto: tick[2],
      bajo: tick[3],
      volumen: tick[5],
    }));

    // Acumular las velas al inicio del archivo (hacia atrás)
    data = [...nuevasVelas, ...data];

    // Guardar los datos en el archivo JSON
    fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));

    console.log('Velas descargadas y guardadas exitosamente.');
  }, { limit: limit, startTime: startTime });
}

// Llamamos a la función para obtener las velas hacia atrás
obtenerVelasHaciaAtras();
