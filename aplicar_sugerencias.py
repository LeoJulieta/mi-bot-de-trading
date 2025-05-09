import json
import os

RUTA_REPORTE = "reporte_analisis.json"

def aplicar_correcciones():
    if not os.path.exists(RUTA_REPORTE):
        print("No se encontró el archivo de reporte de análisis.")
        return

    with open(RUTA_REPORTE, "r", encoding="utf-8") as f:
        reporte = json.load(f)

    cambios_realizados = 0

    for item in reporte:
        archivo = item["archivo"]
        errores = item["errores"]

        if not os.path.exists(archivo):
            print(f"No se encontró el archivo: {archivo}")
            continue

        with open(archivo, "r", encoding="utf-8") as f:
            lineas = f.readlines()

        for error in errores:
            if error["tipo"] == "SyntaxError":
                linea_idx = error["linea"] - 1
                if linea_idx < len(lineas):
                    # Agrega un comentario automático para marcar error
                    lineas[linea_idx] = lineas[linea_idx].rstrip("\n") + "  # Posible error de sintaxis\n"
                    cambios_realizados += 1

        with open(archivo, "w", encoding="utf-8") as f:
            f.writelines(lineas)

    print(f"Correcciones aplicadas en {cambios_realizados} líneas.")

if __name__ == "__main__":
    aplicar_correcciones()
