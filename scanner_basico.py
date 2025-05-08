import os
import ast
import json
import subprocess
from pathlib import Path

REPO_URL = "https://github.com/LeoJulieta/mi-bot-de-trading.git"
CLONE_DIR = "mi-bot-de-trading"

def clonar_repo():
    if os.path.exists(CLONE_DIR):
        print("Repositorio ya clonado.")
    else:
        subprocess.run(["git", "clone", REPO_URL])

def obtener_archivos_py(directorio):
    return [f for f in Path(directorio).rglob("*.py") if f.is_file()]

def analizar_codigo(path_archivo):
    observaciones = []
    try:
        with open(path_archivo, "r", encoding="utf-8") as f:
            source = f.read()
        tree = ast.parse(source)
        for nodo in ast.walk(tree):
            if isinstance(nodo, ast.FunctionDef) and len(nodo.body) == 1 and isinstance(nodo.body[0], ast.Pass):
                observaciones.append(f"Función vacía: {nodo.name}")
            if isinstance(nodo, ast.FunctionDef) and not ast.get_docstring(nodo):
                observaciones.append(f"Función sin docstring: {nodo.name}")
    except Exception as e:
        observaciones.append(f"Error al analizar {path_archivo.name}: {e}")
    return observaciones

def escanear():
    clonar_repo()
    resultados = {}
    archivos = obtener_archivos_py(CLONE_DIR)
    for archivo in archivos:
        obs = analizar_codigo(archivo)
        if obs:
            resultados[str(archivo)] = obs
    with open("reporte_analisis.json", "w", encoding="utf-8") as f:
        json.dump(resultados, f, indent=2, ensure_ascii=False)
    print("Análisis completo. Resultados guardados en 'reporte_analisis.json'.")

if __name__ == "__main__":
    escanear()
