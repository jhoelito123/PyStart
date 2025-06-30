import requests
import json

# Test de registro de docente
url = "http://localhost:8000/api/users/docentes/register"

docente_data = {
    "user": {
        "username_user": "docentejuan",
        "nombre_user": "Prof. Juan",
        "apellido_user": "Martinez",
        "email_user": "docente@test.com",
        "password_user": "password123",
        "tipo_de_user": 3,  # Assuming 3 is for docente
    },
    "nombre_docente": "Juan",
    "apellidos_docente": "Martinez",
    "ci_docente": "12345678",
    "telefono_docente": "1234567890",
}

print("=== Registrando docente ===")
try:
    response = requests.post(
        url, json=docente_data, headers={"Content-Type": "application/json"}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    if response.status_code == 201:
        print("✓ Docente registrado exitosamente")
    else:
        print("✗ Error en el registro")

except Exception as e:
    print(f"Error: {e}")
