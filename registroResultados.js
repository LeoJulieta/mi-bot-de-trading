const fs = require('fs');
const path = './resultados.json';

// Inicializar el archivo de resultados si no existe
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ resultados: [] }));
}

// Función para registrar resultados
function registrarResultado(patron, fueGanadora) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));

    // Crear un nuevo registro para el patrón
    const resultado = {
        patron,
        fecha: new Date(),
        fueGanadora,
    };

    // Guardar el nuevo resultado
    data.resultados.push(resultado);

    // Escribir los datos actualizados en el archivo
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Resultado registrado en resultados.json');
}

module.exports = { registrarResultado };
