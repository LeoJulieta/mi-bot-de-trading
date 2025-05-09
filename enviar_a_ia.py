import json

def leer_reporte(archivo="reporte_analisis.json"):
    try:
        with open(archivo, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print("No se encontró el archivo de análisis.")
        return []

def generar_resumen(errores):
    resumen = []
    for item in errores:
        archivo = item["archivo"]
        for error in item["errores"]:
            resumen.append(f"{archivo} -> {error['tipo']} en línea {error.get('linea', '?')}: {error['mensaje']}")
    return "\n".join(resumen)

if __name__ == "__main__":
    errores = leer_reporte()
    if errores:
        resumen = generar_resumen(errores)
        print("Resumen para IA:\n")
        print(resumen)
        print("\nEsperando respuesta de la IA...")
        # Acá vendría la lógica real de interacción con una API o interfaz
    else:
        print("No se encontraron errores para reportar.")
