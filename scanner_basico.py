import os
import ast
import json

IGNORAR_ARCHIVOS = {"scanner_basico.py", "enviar_a_ia.py"}
IGNORAR_CARPETAS = {".git", ".github", "__pycache__"}

def analizar_archivo(filepath):
    errores = []
    try:
        with open(filepath, "r", encoding="utf-8") as file:
            contenido = file.read()
            ast.parse(contenido)
    except SyntaxError as e:
        errores.append({
            "tipo": "SyntaxError",
            "mensaje": str(e),
            "linea": e.lineno,
            "columna": e.offset
        })
    except Exception as e:
        errores.append({
            "tipo": "ErrorGeneral",
            "mensaje": str(e)
        })
    return errores

def escanear_directorio(base_path):
    resultados = []
    for root, dirs, files in os.walk(base_path):
        dirs[:] = [d for d in dirs if d not in IGNORAR_CARPETAS]
        for file in files:
            if file.endswith(".py") and file not in IGNORAR_ARCHIVOS:
                ruta_completa = os.path.join(root, file)
                errores = analizar_archivo(ruta_completa)
                if errores:
                    resultados.append({
                        "archivo": ruta_completa,
                        "errores": errores
                    })
    return resultados

def guardar_resultados(resultados, archivo_salida="reporte_analisis.json"):
    with open(archivo_salida, "w", encoding="utf-8") as f:
        json.dump(resultados, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    print("Iniciando escaneo del proyecto...")
    resultados = escanear_directorio(".")
    guardar_resultados(resultados)
    print(f"Análisis completado. Resultados guardados en 'reporte_analisis.json'.")
