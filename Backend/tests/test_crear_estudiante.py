import requests
import json

# Crear un estudiante simple para probar login
url_estudiante = "http://localhost:8000/api/users/estudiante/register"

estudiante_data = {
    "user": {
        "username_user": "estudiante3",
        "password_user": "password123",
        "email_user": "estudiante3@test.com",
        "tipo_de_user": 2,  # Tipo estudiante
    },
    "nombre_estudiante": "Carlos",
    "apellidos_estudiante": "López",
    "ci_estudiante": "11223344",
    "institucion_id": 1,  # Asumiendo que existe institucion con ID 1
}

print("=== Creando estudiante para pruebas ===")
try:
    response = requests.post(
        url_estudiante,
        json=estudiante_data,
        headers={"Content-Type": "application/json"},
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    if response.status_code == 201:
        print("✅ Estudiante creado exitosamente")

        # Ahora probar login del estudiante
        print("\n=== Probando login del estudiante ===")
        login_url = "http://localhost:8000/api/users/login/"
        login_data = {
            "email_user": "estudiante3@test.com",
            "password_user": "password123",
        }

        login_response = requests.post(
            login_url, json=login_data, headers={"Content-Type": "application/json"}
        )
        print(f"Login Status: {login_response.status_code}")
        print(f"Login Response: {login_response.text}")
    else:
        print("❌ Error creando estudiante")

except Exception as e:
    print(f"Error: {e}")
