const { exec } = require('child_process');
const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

exec('node autoentrenador.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al entrenar: ${error.message}`);
    return;
  }

  const patronMasFuerte = stdout.match(/│ doji │ +(\d+)/) || stdout.match(/│ martillo │ +(\d+)/);
  const cantidad = patronMasFuerte ? patronMasFuerte[1] : 'N/A';

  // Mostrar resultado en consola
  console.log("Entrenamiento ejecutado. Resultados guardados.");
  
  // Enviar notificación
  exec(`termux-notification --title "Entrenamiento listo" --content "Ejecutado a las ${hora}. Patrón doji: ${cantidad}"`);
});
