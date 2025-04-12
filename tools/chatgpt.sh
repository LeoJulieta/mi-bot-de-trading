# Agregar información del último backup
ULTIMO_BACKUP=$(ls -t backups/*.zip 2>/dev/null | head -n 1)
echo "{ \"ultimo_backup\": \"$ULTIMO_BACKUP\" }" >> chatgpt/para_enviar.json
