import requests
import json

# Test de registro de estudiante
url = "http://localhost:8000/api/users/estudiante/register"
data = {
    "user": {
        "username_user": "test_estudiante",
        "password_user": "password123",
        "email_user": "test@ejemplo.com",
        "tipo_de_user": 2
    },
    "nombre_estudiante": "Juan",
    "apellidos_estudiante": "Pérez",
    "ci_estudiante": "12345678",
    "institucion_id": 1
}

try:
    response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
