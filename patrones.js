// patrones.js
function detectarMartillo(candela) {
  const cuerpo = Math.abs(candela.open - candela.close);
  const mechaInferior = Math.min(candela.open, candela.close) - candela.low;
  const mechaSuperior = candela.high - Math.max(candela.open, candela.close);
  return cuerpo < mechaInferior && mechaInferior > mechaSuperior * 2;
}

function detectarDoji(candela) {
  const cuerpo = Math.abs(candela.open - candela.close);
  const rango = candela.high - candela.low;
  return cuerpo < rango * 0.1;
}

function detectarEnvolventeAlcista(prev, actual) {
  return (
    prev.close < prev.open &&
    actual.open < actual.close &&
    actual.open < prev.close &&
    actual.close > prev.open
  );
}

function detectarEnvolventeBajista(prev, actual) {
  return (
    prev.close > prev.open &&
    actual.open > actual.close &&
    actual.open > prev.close &&
    actual.close < prev.open
  );
}

function detectarEstrellaFugaz(candela) {
  const cuerpo = Math.abs(candela.open - candela.close);
  const mechaSuperior = candela.high - Math.max(candela.open, candela.close);
  const mechaInferior = Math.min(candela.open, candela.close) - candela.low;
  return mechaSuperior > cuerpo * 2 && mechaInferior < cuerpo;
}

function detectar4RojasYUnaVerde(ultimas) {
  if (ultimas.length < 5) return false;
  const rojas = ultimas.slice(0, 4).every(c => c.close < c.open);
  const verde = ultimas[4].close > ultimas[4].open;
  return rojas && verde;
}

module.exports = {
  detectarMartillo,
  detectarDoji,
  detectarEnvolventeAlcista,
  detectarEnvolventeBajista,
  detectarEstrellaFugaz,
  detectar4RojasYUnaVerde
};
