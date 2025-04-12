const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Leer archivo JSON desde el disco
function leerArchivoJSON(nombreArchivo) {
  const ruta = path.join(__dirname, nombreArchivo);
  const contenido = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(contenido);
}

// Endpoint para velas
app.get("/api/candles", (req, res) => {
  try {
    const datos = leerArchivoJSON("candles.json");
    res.json(datos);
  } catch (err) {
    console.error("Error al leer candles.json:", err);
    res.status(500).send("Error al leer candles.json");
  }
});

// Endpoint para resultados de backtest
app.get("/api/backtest", (req, res) => {
  try {
    const datos = leerArchivoJSON("backtest.json");
    res.json(datos);
  } catch (err) {
    console.error("Error al leer backtest.json:", err);
    res.status(500).send("Error al leer backtest.json");
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
