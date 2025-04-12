#!/data/data/com.termux/files/usr/bin/bash

cd ~/mi-bot-de-trading

# Ejecutar escaneo
node tools/ls-scan.js >> logs/autolog.log 2>&1
echo "Escaneo ejecutado en: $(date)" >> logs/autolog.log

# Backup cada 12 horas
BACKUP_TIMESTAMP_FILE=logs/last_backup_time.txt
NOW=$(date +%s)
if [ -f "$BACKUP_TIMESTAMP_FILE" ]; then
  LAST=$(cat "$BACKUP_TIMESTAMP_FILE")
else
  LAST=0
fi

DIFF=$((NOW - LAST))
if [ "$DIFF" -ge 43200 ]; then
  bash tools/backup.sh >> logs/autolog.log 2>&1
  echo "$NOW" > "$BACKUP_TIMESTAMP_FILE"
  echo "Backup ejecutado en: $(date)" >> logs/autolog.log
fi
