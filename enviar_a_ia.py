import os

RUTA_ERRORES = "errores_detectados.txt"
RUTA_SUGERENCIAS = "sugerencias.md"


def simular_ia(texto_error):
    """Simula una sugerencia tipo IA para cada error"""
    if "SyntaxError" in texto_error:
        return "Revisar la sintaxis del archivo. Posiblemente falta un paréntesis, coma o dos puntos."
    if "FileNotFoundError" in texto_error:
        return "Verificar si el archivo o ruta existe y está bien referenciado."
    if "NameError" in texto_error:
        return "Revisar si la variable o función fue declarada correctamente antes de usarla."
    return "Revisar el código en esa línea y validar su funcionamiento."


def generar_sugerencias():
    if not os.path.exists(RUTA_ERRORES):
        print("No se encontró el archivo de errores.")
        return

    with open(RUTA_ERRORES, "r", encoding="utf-8") as f:
        errores = f.readlines()

    sugerencias = []
    for error in errores:
        error = error.strip()
        if error:
            sugerencia = simular_ia(error)
            sugerencias.append(
                f"- **Error:** {error}\n  **Sugerencia IA:** {sugerencia}\n"
            )

    with open(RUTA_SUGERENCIAS, "w", encoding="utf-8") as f:
        f.write("# Sugerencias generadas por IA (simuladas)\n\n")
        f.writelines("\n".join(sugerencias))

    print(f"{len(sugerencias)} sugerencias generadas en {RUTA_SUGERENCIAS}")


if __name__ == "__main__":
    generar_sugerencias()
