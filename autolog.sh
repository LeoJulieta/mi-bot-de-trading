#!/data/data/com.termux/files/usr/bin/bash

# Ruta al directorio base del proyecto
cd ~/mi-bot-de-trading

# Ejecutar el escaneo de archivos
node tools/ls-scan.js >> logs/autolog.log 2>&1

# Agrega una línea con la fecha para seguimiento
echo "Escaneo ejecutado en: $(date)" >> logs/autolog.log
