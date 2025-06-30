import requests
import json

# Crear un docente para completar las pruebas
url_docente = "http://localhost:8000/api/users/docentes/register"

docente_data = {
    "user": {
        "username_user": "docente1",
        "password_user": "password123",
        "email_user": "docente1@test.com",
        "tipo_de_user": 3  # Tipo docente
    },
    "nombre_docente": "Ana",
    "apellidos_docente": "Martínez",
    "ci_docente": "55667788",
    "telefono_docente": "1234567890"
}

print("=== Creando docente para pruebas ===")
try:
    response = requests.post(url_docente, json=docente_data, headers={"Content-Type": "application/json"})
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ Docente creado exitosamente")
        
        # Ahora probar login del docente
        print("\n=== Probando login del docente ===")
        login_url = "http://localhost:8000/api/users/login/"
        login_data = {
            "email_user": "docente1@test.com",
            "password_user": "password123"
        }
        
        login_response = requests.post(login_url, json=login_data, headers={"Content-Type": "application/json"})
        print(f"Login Status: {login_response.status_code}")
        print(f"Login Response: {login_response.text}")
    else:
        print("❌ Error creando docente")
        
except Exception as e:
    print(f"Error: {e}")
