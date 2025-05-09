import json
import os
import re

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

        nuevas_lineas = lineas[:]
        offset = 0  # por si insertamos líneas

        for error in errores:
            tipo = error["tipo"]
            linea_idx = error["linea"] - 1 + offset

            if 0 <= linea_idx < len(nuevas_lineas):
                original = nuevas_lineas[linea_idx]

                if tipo == "SyntaxError":
                    if re.match(
                        r"^\s*(if|for|while|def|elif|else).*[^:]\s*$", original.strip()
                    ):
                        nuevas_lineas[linea_idx] = original.rstrip("\n") + ":\n"
                        cambios_realizados += 1

                elif tipo == "NameError":
                    match = re.findall(r"\b([a-zA-Z_][a-zA-Z0-9_]*)\b", original)
                    for var in match:
                        if var not in (
                            "print",
                            "range",
                            "len",
                            "int",
                            "str",
                        ):  # funciones comunes
                            nueva_linea = f'{var} = "valor_autogenerado"\n'
                            nuevas_lineas.insert(linea_idx, nueva_linea)
                            offset += 1
                            cambios_realizados += 1
                            break

                elif tipo == "IndentationError":
                    nuevas_lineas[linea_idx] = "    " + original.lstrip()
                    cambios_realizados += 1

                elif tipo == "TypeError":
                    nuevas_lineas[linea_idx] = "# Revisar tipos: " + original
                    cambios_realizados += 1

        with open(archivo, "w", encoding="utf-8") as f:
            f.writelines(nuevas_lineas)

    print(f"Correcciones reales aplicadas en {cambios_realizados} líneas.")


if __name__ == "__main__":
    aplicar_correcciones()
