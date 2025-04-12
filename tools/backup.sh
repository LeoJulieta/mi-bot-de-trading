#!/data/data/com.termux/files/usr/bin/bash

# Crear backup comprimido del proyecto (sin node_modules ni resultados pesados)
PROYECTO=~/mi-bot-de-trading
DESTINO="$PROYECTO/backups"
FECHA=$(date +"%Y-%m-%d_%H-%M")
ARCHIVO="$DESTINO/backup-$FECHA.zip"

mkdir -p "$DESTINO"

cd "$PROYECTO"

zip -r "$ARCHIVO" . -x "node_modules/*" "logs/*" "resultados/*" "*.zip" "*.png" "*.jpg" "backups/*"

echo "✅ Backup generado: $ARCHIVO"
