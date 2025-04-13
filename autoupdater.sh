#!/data/data/com.termux/files/usr/bin/bash

while true; do
  echo "---- AUTOBACKUP ----"
  bash ~/mi-bot-de-trading/autolog.sh
  echo "---- Esperando 5 minutos ----"
  sleep 300
done
