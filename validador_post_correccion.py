import subprocess
import os
import json


def compilar_codigo():
    print("Compilando código...")
    try:
        result = subprocess.run(
            ["python", "-m", "compileall", "."],
            capture_output=True,
            text=True,
            check=True,
        )
        print("Compilación exitosa.")
        return True
    except subprocess.CalledProcessError as e:
        print("Error al compilar el código:")
        print(e.stdout)
        print(e.stderr)
        return False


def cargar_resumen_y_reducir(txt_path="resumen_analisis.txt", limite=2000):
    if not os.path.exists(txt_path):
        return "No se encontró el resumen de análisis."

    with open(txt_path, "r", encoding="utf-8") as f:
        contenido = f.read()

    if len(contenido) > limite:
        return contenido[-limite:]  # solo los últimos caracteres
    return contenido


def generar_json_resumen(
    txt_path="resumen_analisis.txt", json_path="resumen_analisis.json", limite=2000
):
    resumen_texto = cargar_resumen_y_reducir(txt_path, limite)
    resumen_json = {"resumen": resumen_texto.strip()}

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(resumen_json, f, indent=2, ensure_ascii=False)

    print(f"Resumen estructurado guardado en {json_path}")


def main():
    print("Iniciando validación post-corrección...")

    if not compilar_codigo():
        print("El código tiene errores de compilación. Revisión necesaria.")
        exit(1)

    resumen = cargar_resumen_y_reducir()
    print("\n--- RESUMEN REDUCIDO PARA IA (máx. 2000 caracteres) ---\n")
    print(resumen)
    print("\n--- FIN DEL RESUMEN ---")

    generar_json_resumen()


if __name__ == "__main__":
    main()
