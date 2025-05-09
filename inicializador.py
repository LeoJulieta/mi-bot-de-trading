import os

estructura = {
    "core": [
        ("planificador_autonomo.py", "# Coordina el flujo de planificación y ejecución\n"),
        ("refinador_prompt.py", "# Refina el objetivo en subtareas concretas\n"),
        ("ejecutor_inteligente.py", "# Ejecuta cada subtarea según reglas o IA\n"),
        ("gestor_estado.py", "# Guarda logs y estado actual del sistema\n"),
    ],
    "agentes": [
        ("agente_analisis.py", "# Analiza código y detecta oportunidades de mejora\n"),
        ("agente_tests.py", "# Genera y ejecuta tests automáticos\n"),
    ],
    "validadores": [
        ("validador_post_correccion.py", "# Verifica si el código sigue siendo válido después de cambios\n"),
    ],
    "herramientas": [
        ("analizador_codigo.py", "# Funciones auxiliares de análisis sintáctico/estático\n"),
        ("gestor_git.py", "# Utilidades para commit, push, branch, etc.\n"),
        ("generador_resumenes.py", "# Genera reportes compactos y claros\n"),
    ],
    "proyectos/mi_app": [],
    "resultados/logs": [],
    "resultados/resúmenes": [],
    "interfaz": [
        ("dashboard.py", "# (Opcional) Interfaz para visualizar estado/logs\n"),
        ("visor_logs.py", "# Permite navegar los logs generados por el sistema\n"),
    ],
    "tests": [
        ("test_planificador.py", "# Tests unitarios para el planificador autónomo\n"),
    ],
    "config": [
        ("config_global.yaml", "# Configuración general del sistema\n"),
        ("config_mi_app.yaml", "# Configuración específica para el proyecto 'mi_app'\n"),
    ],
}

base_dir = "automejora_ia"

for carpeta, archivos in estructura.items():
    ruta = os.path.join(base_dir, carpeta)
    os.makedirs(ruta, exist_ok=True)
    for archivo, contenido in archivos:
        archivo_path = os.path.join(ruta, archivo)
        with open(archivo_path, "w") as f:
            f.write(contenido)

# Crear README e iniciar.py
with open(os.path.join(base_dir, "README.md"), "w") as f:
    f.write("# Sistema de Mejora Autónoma de Código\n")

with open(os.path.join(base_dir, "iniciar.py"), "w") as f:
    f.write("# Punto de entrada principal\n")

print("Estructura base creada exitosamente.")
