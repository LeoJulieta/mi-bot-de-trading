// actualizar_historico.js
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const archivo = 'historico.json';
const par = 'USDTBRL';
const intervalo = '1m';
const limite = 1000; // máximo permitido por Binance por petición

async function obtenerUltimoTimestamp() {
    if (!fs.existsSync(archivo)) return null;
    const data = JSON.parse(fs.readFileSync(archivo));
    return data.length ? data[data.length - 1][0] : null;
}

async function descargarVelasBinance(desdeTimestamp) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${par}&interval=${intervalo}&limit=${limite}` +
                (desdeTimestamp ? `&startTime=${desdeTimestamp + 1}` : '');
    const respuesta = await axios.get(url);
    return respuesta.data;
}

async function actualizarHistorico() {
    const historicoExistente = fs.existsSync(archivo)
        ? JSON.parse(fs.readFileSync(archivo))
        : [];

    const ultimoTimestamp = await obtenerUltimoTimestamp();
    const nuevasVelas = await descargarVelasBinance(ultimoTimestamp);

    if (nuevasVelas.length === 0) {
        console.log('No hay nuevas velas.');
        return;
    }

    const nuevoHistorico = [...historicoExistente, ...nuevasVelas];
    fs.writeFileSync(archivo, JSON.stringify(nuevoHistorico, null, 2));
    console.log(`Se agregaron ${nuevasVelas.length} nuevas velas. Total: ${nuevoHistorico.length}`);
}

actualizarHistorico().catch(console.error);
