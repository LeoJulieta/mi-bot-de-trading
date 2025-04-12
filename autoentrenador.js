const { exec } = require('child_process');
const fs = require('fs');

function notificar(titulo, contenido) {
  exec(`termux-notification --title "${titulo}" --content "${contenido}"`);
}

function entrenarSiEsHorario() {
  const hora = new Date().getHours();
  const minutos = new Date().getMinutes();

  const horariosPermitidos = [6, 15, 22]; // 06:00, 15:00, 22:00
if (true) {
    notificar("Entrenamiento", `Iniciando autoentrenamiento de las ${hora}:00`);

    exec('node entrenamiento.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al entrenar: ${error.message}`);
        return;
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      console.log(`stdout:\n${stdout}`);
      notificar("Entrenamiento completo", `Entrenamiento finalizado a las ${hora}:00`);
    });
  }
}

// Revisa cada minuto si es hora de entrenar
notificar("Autoentrenador activado", "Verificando horarios cada minuto...");
setInterval(entrenarSiEsHorario, 60 * 1000); // cada 60 segundos
