from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Usuario, Admin, Docente, Estudiante

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['username_user', 'password_user', 'email_user']
        extra_kwargs = {
            'password_user': {'write_only': True, 'required': True}
        }
    
    def create(self, data):
        data['password_user'] = make_password(data['password_user'])
        return super().create(data)

class AdminCreateSerializer(serializers.ModelSerializer):
    # Aquí anidamos el UsuarioSerializer y le decimos que su fuente es el campo 'user_id' del modelo Admin
    user = UsuarioSerializer(source='user_id')

    class Meta:
        model = Admin
        fields = ['user']

    def create(self, validated_data):
        # Extrae los datos del usuario anidado
        user_data = validated_data.pop('user_id')

        user = Usuario.objects.create(**user_data)

        admin = Admin.objects.create(user_id=user, **validated_data)
        return admin

class DocenteCreateSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(source='user_id') # <--- IMPORTANTE: Usamos 'source'

    class Meta:
        model = Docente
        fields = ['user', 'nombre_docente', 'apellidos_docente', 'ci_docente', 'telefono_docente']

    def create(self, validated_data):
        user_data = validated_data.pop('user_id') # <--- Ahora es 'user_id' por el 'source'

        user = Usuario.objects.create(**user_data)

        docente = Docente.objects.create(user_id=user, **validated_data)
        return docente

class DocenteDetailSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(read_only=True, source='user_id') # <--- IMPORTANTE: Usamos 'source'

    class Meta:
        model = Docente
        fields = ['user', 'nombre_docente', 'apellidos_docente', 'ci_docente', 'telefono_docente']

class EstudianteCreateSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(source='user_id') # <--- IMPORTANTE: Usamos 'source'

    class Meta:
        model = Estudiante
        fields = ['user', 'nombre_estudiante', 'apellidos_estudiante', 'ci_estudiante']

    def create(self, validated_data):
        user_data = validated_data.pop('user_id') # <--- Ahora es 'user_id' por el 'source'
        user = Usuario.objects.create(**user_data)
        estudiante = Estudiante.objects.create(user_id=user, **validated_data)
        return estudiante
    
    
class EstudianteDetailSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(read_only=True, source='user_id')

    class Meta:
        model = Estudiante
        fields = ['user', 'nombre_estudiante', 'apellidos_estudiante', 'ci_estudiante']
