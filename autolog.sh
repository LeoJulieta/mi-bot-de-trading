#!/data/data/com.termux/files/usr/bin/bash

# Ruta base del proyecto
cd ~/mi-bot-de-trading

# Fecha actual
FECHA=$(date '+%Y-%m-%d')
HORA=$(date '+%H:%M:%S')
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M')

# Ejecutar escaneo de archivos y loguear
echo "[$HORA] Iniciando escaneo automático..." >> logs/autolog.log
node tools/ls-scan.js >> logs/autolog.log 2>&1
echo "Escaneo ejecutado en: $(date)" >> logs/autolog.log

# Guardar fragmento de charla desde notificaciones (si jq está instalado)
if command -v jq > /dev/null; then
    CHARLA=$(timeout 3s termux-notification-list | jq -r '.[] | select(.app=="com.termux") | .summary' | tail -n 1)
    if [ -n "$CHARLA" ]; then
        echo "Log de charla: $(date)" >> chatlog.md
        echo "$CHARLA" >> chatlog.md
        echo "" >> chatlog.md
    else
        echo "No se encontraron nuevas notificaciones de Termux." >> logs/autolog.log
    fi
else
    echo "jq no está instalado. No se pudo guardar la charla." >> logs/autolog.log
fi

# Crear resumen diario
mkdir -p resumenes
RESUMEN="resumenes/$FECHA-resumen.md"
echo "## Resumen del $FECHA" > "$RESUMEN"
echo "- Escaneo automático ejecutado a las $HORA" >> "$RESUMEN"
echo "- Backup de charla y archivos sincronizado" >> "$RESUMEN"
echo "- Cambios subidos a GitHub" >> "$RESUMEN"

# Actualizar README dinámico
echo "# Proyecto: Mi bot de trading" > README.md
echo "" >> README.md
echo "Última actualización: $(date)" >> README.md
echo "" >> README.md
echo "## Estructura de carpetas" >> README.md
tree -L 2 >> README.md
echo "" >> README.md
echo "## Últimos cambios" >> README.md
git log -3 --pretty=format:"- %h %s (%ci)" >> README.md

# Crear backup comprimido
mkdir -p backups
ZIPFILE="backups/backup-$TIMESTAMP.zip"
zip -r "$ZIPFILE" . -x "node_modules/*" "*.zip" "*.mp4" "*.jpg" >> logs/autolog.log 2>&1
echo "✅ Backup generado: $ZIPFILE" >> logs/autolog.log
echo "Backup ejecutado en: $(date)" >> logs/autolog.log

# Git add, commit y push
git add .
git commit -m "Auto backup y sincronización: $FECHA $HORA" >> logs/git.log 2>&1
git push origin main >> logs/git.log 2>&1
