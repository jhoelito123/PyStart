from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario, Admin, Docente, Estudiante, TipoUsuario
from education.models import Institucion, EstudianteInstitucion


class UsuarioSerializer(serializers.ModelSerializer):
    tipo_de_user = serializers.PrimaryKeyRelatedField(
        queryset=TipoUsuario.objects.all(), write_only=True
    )
    tipo_de_user_display = serializers.CharField(
        source="tipo_de_user.tipo_usuario", read_only=True
    )

    class Meta:
        model = Usuario
        fields = [
            "username_user",
            "password_user",
            "email_user",
            "tipo_de_user",
            "tipo_de_user_display",
        ]
        extra_kwargs = {
            "password_user": {"write_only": True, "required": True},
            "tipo_de_user": {"required": True},
        }


class AdminCreateSerializer(serializers.ModelSerializer):
    # Aquí anidamos el UsuarioSerializer y le decimos que su fuente es el campo 'user_id' del modelo Admin
    user = UsuarioSerializer(source="user_id")

    class Meta:
        model = Admin
        fields = ["user"]

    def create(self, validated_data):
        # Extrae los datos del usuario anidado
        user_data = validated_data.pop("user_id")

        user = Usuario.objects.create(**user_data)

        admin = Admin.objects.create(user_id=user, **validated_data)
        return admin


class DocenteCreateSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(source="user_id")  # <--- IMPORTANTE: Usamos 'source'

    class Meta:
        model = Docente
        fields = [
            "user",
            "nombre_docente",
            "apellidos_docente",
            "ci_docente",
            "telefono_docente",
        ]

    def create(self, validated_data):
        user_data = validated_data.pop(
            "user_id"
        )  # <--- Ahora es 'user_id' por el 'source'

        user = Usuario.objects.create(**user_data)

        docente = Docente.objects.create(user_id=user, **validated_data)
        return docente


class DocenteDetailSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(
        read_only=True, source="user_id"
    )  # <--- IMPORTANTE: Usamos 'source'

    class Meta:
        model = Docente
        fields = [
            "user",
            "nombre_docente",
            "apellidos_docente",
            "ci_docente",
            "telefono_docente",
        ]


class EstudianteCreateSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(source="user_id")
    institucion_id = serializers.PrimaryKeyRelatedField(
        queryset=Institucion.objects.all(),
        write_only=True,
        required=True,
        help_text="ID de la institución a la que el estudiante se va a registrar."
    )

    class Meta:
        model = Estudiante
        fields = [
            "user", 
            "nombre_estudiante", 
            "apellidos_estudiante", 
            "ci_estudiante", 
            "institucion_id"
        ]

    def create(self, validated_data):
        user_data = validated_data.pop("user_id")
        institucion = validated_data.pop("institucion_id")

        user = Usuario.objects.create(**user_data)

        estudiante = Estudiante.objects.create(user_id=user, **validated_data)

        # Relación EstudianteInstitucion
        EstudianteInstitucion.objects.create(
            estudiante_id=estudiante,
            institucion_id=institucion
        )
        
        return estudiante


class EstudianteDetailSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(read_only=True, source="user_id")

    class Meta:
        model = Estudiante
        fields = ["user", "nombre_estudiante", "apellidos_estudiante", "ci_estudiante"]


class LoginSerializer(serializers.Serializer):
    email_user = serializers.EmailField(label="Correo Electrónico", write_only=True)
    password_user = serializers.CharField(
        label="Contraseña",
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )

    def validate(self, data):
        email = data.get("email_user")
        password = data.get("password_user")

        if email and password:
            try:
                user = Usuario.objects.get(email_user=email)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError(
                    "Credenciales inválidas.", code="authorization"
                )

            if user.password_user != password:
                raise serializers.ValidationError(
                    "Credenciales inválidas.", code="authorization"
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    "La cuenta de usuario está inactiva.", code="authorization"
                )

            data["user"] = user
        else:
            raise serializers.ValidationError(
                "Debe incluir 'correo electrónico' y 'contraseña'.",
                code="authorization",
            )

        return data
