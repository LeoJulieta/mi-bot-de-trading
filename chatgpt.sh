#!/data/data/com.termux/files/usr/bin/bash

# Archivo: chatgpt.sh

# Directorios importantes
JSON_FILE="logs/input_para_chatgpt.json"
DESTINO_DIR="chatgpt"
DESTINO_FILE="$DESTINO_DIR/para_enviar.json"

# Verificar comandos
if [ "$1" = "enviar" ] && [ "$2" = "ls" ]; then
    echo "→ Ejecutando escaneo..."
    node tools/ls-scan.js

    # Crear carpeta si no existe
    mkdir -p "$DESTINO_DIR"

    if [ -f "$JSON_FILE" ]; then
        cp "$JSON_FILE" "$DESTINO_FILE"
        echo "✅ Archivo actualizado: $DESTINO_FILE"
        echo "Ahora podés enviárselo a ChatGPT."
    else
        echo "❌ No se encontró el archivo $JSON_FILE"
    fi
else
    echo "Uso: bash chatgpt.sh enviar ls"
fi
