import os
import py_compile

def validar_codigo(base_dir="."):
    errores = []
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".py"):
                ruta = os.path.join(root, file)
                try:
                    py_compile.compile(ruta, doraise=True)
                except py_compile.PyCompileError as e:
                    errores.append((ruta, str(e)))

    if errores:
        print("Errores de compilación detectados:")
        for ruta, error in errores:
            print(f"{ruta}:\n{error}\n")
    else:
        print("Validación exitosa: todo el código compiló correctamente.")

if __name__ == "__main__":
    validar_codigo()
