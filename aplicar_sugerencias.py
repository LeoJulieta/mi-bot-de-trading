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
            tipo = error["tipo"]
            linea_idx = error["linea"] - 1

            if 0 <= linea_idx < len(lineas):
                comentario = ""

                if tipo == "SyntaxError":
                    comentario = "# Posible error de sintaxis"
                elif tipo == "NameError":
                    comentario = "# Posible variable o función no definida"
                elif tipo == "IndentationError":
                    comentario = "# Posible error de indentación"
                elif tipo == "TypeError":
                    comentario = "# Posible uso incorrecto de tipo de dato"
                else:
                    comentario = f"# Posible error detectado: {tipo}"

                if comentario and comentario not in lineas[linea_idx]:
                    lineas[linea_idx] = lineas[linea_idx].rstrip("\n") + f"  {comentario}\n"
                    cambios_realizados += 1

        with open(archivo, "w", encoding="utf-8") as f:
            f.writelines(lineas)

    print(f"Correcciones aplicadas en {cambios_realizados} líneas.")

if __name__ == "__main__":
    aplicar_correcciones()
