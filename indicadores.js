// indicadores.js
function calcularEMA(data, periodo) {
  const k = 2 / (periodo + 1);
  let ema = data.slice(0, periodo).reduce((a, b) => a + b, 0) / periodo;
  const resultados = [ema];

  for (let i = periodo; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    resultados.push(ema);
  }

  return resultados;
}

function calcularRSI(data, periodo = 14) {
  let ganancias = 0;
  let perdidas = 0;

  for (let i = 1; i <= periodo; i++) {
    const cambio = data[i] - data[i - 1];
    if (cambio >= 0) ganancias += cambio;
    else perdidas -= cambio;
  }

  let rs = ganancias / perdidas;
  const rsi = [100 - 100 / (1 + rs)];

  for (let i = periodo + 1; i < data.length; i++) {
    const cambio = data[i] - data[i - 1];
    if (cambio >= 0) {
      ganancias = (ganancias * (periodo - 1) + cambio) / periodo;
      perdidas = (perdidas * (periodo - 1)) / periodo;
    } else {
      ganancias = (ganancias * (periodo - 1)) / periodo;
      perdidas = (perdidas * (periodo - 1) - cambio) / periodo;
    }

    rs = ganancias / perdidas;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
}

module.exports = {
  calcularEMA,
  calcularRSI
};
