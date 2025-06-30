import requests
import json

# Test simple de login - solo enviar datos y ver respuesta
url = "http://localhost:8000/api/users/login/"

# Probamos con todos los tipos de usuarios
usuarios_test = [
    {"email_user": "admin@pystart.com", "password_user": "admin123"},
    {"email_user": "estudiante3@test.com", "password_user": "password123"},
    {"email_user": "docente1@test.com", "password_user": "password123"},
]

print("=== PRUEBAS DE LOGIN ===")

for i, usuario in enumerate(usuarios_test, 1):
    print(f"\n--- Test {i}: {usuario['email_user']} ---")
    try:
        response = requests.post(
            url, json=usuario, headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login exitoso: {data.get('message', 'Sin mensaje')}")
            print(f"Usuario: {data.get('username', 'N/A')}")
            print(f"Tipo: {data.get('tipo_de_usuario_loggeado', 'N/A')}")
        else:
            print(f"❌ Login fallido: {response.text}")

    except Exception as e:
        print(f"🔥 Error de conexión: {e}")

print("\n" + "=" * 50)
