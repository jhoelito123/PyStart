from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario, Admin, Docente, Estudiante, TipoUsuario
from education.models import Institucion, EstudianteInstitucion, InscripcionCurso


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

    def create(self, validated_data):
        # Hashear la contraseña antes de crear el usuario
        validated_data["password_user"] = make_password(validated_data["password_user"])
        return super().create(validated_data)


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


class AdminDetailSerializer(serializers.ModelSerializer):
    # Anida el UsuarioSerializer para mostrar los datos del usuario asociado al Admin
    # Usamos read_only=True porque no vamos a modificar el usuario a través del serializer del Admin
    user = UsuarioSerializer(read_only=True, source="user_id")

    class Meta:
        model = Admin
        fields = [
            "admin_id",  # ID específico del administrador
            "user",
        ]


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

        # Hash password before creating user
        if "password_user" in user_data:
            user_data["password_user"] = make_password(user_data["password_user"])

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
            "id_docente",
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
        help_text="ID de la institución a la que el estudiante se va a registrar.",
    )

    class Meta:
        model = Estudiante
        fields = [
            "user",
            "nombre_estudiante",
            "apellidos_estudiante",
            "ci_estudiante",
            "institucion_id",
        ]

    def create(self, validated_data):
        user_data = validated_data.pop("user_id")
        institucion = validated_data.pop("institucion_id")

        # Hash password before creating user
        if "password_user" in user_data:
            user_data["password_user"] = make_password(user_data["password_user"])

        user = Usuario.objects.create(**user_data)

        estudiante = Estudiante.objects.create(user_id=user, **validated_data)

        # Relación EstudianteInstitucion
        EstudianteInstitucion.objects.create(
            estudiante_id=estudiante, institucion_id=institucion
        )

        return estudiante


class EstudianteDetailSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer(read_only=True, source="user_id")

    class Meta:
        model = Estudiante
        fields = [
            "user",
            "id_estudiante",
            "nombre_estudiante",
            "apellidos_estudiante",
            "ci_estudiante",
        ]


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
                    "Credenciales inválidas.", code="authentication"
                )

            if not check_password(password, user.password_user):
                raise serializers.ValidationError(
                    "Credenciales inválidas.", code="authentication"
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    "La cuenta de usuario está inactiva.", code="account_inactive"
                )

            data["user"] = user

            user_profile_data = {}
            user_type_display = user.tipo_de_user.tipo_usuario

            if user_type_display == "ESTUDIANTE":
                try:
                    profile_instance = Estudiante.objects.get(user_id=user)
                    user_profile_data = EstudianteDetailSerializer(
                        profile_instance
                    ).data
                except Estudiante.DoesNotExist:
                    raise serializers.ValidationError(
                        "Perfil de estudiante no encontrado o incompleto.",
                        code="profile_missing",
                    )
            elif user_type_display == "DOCENTE":
                try:
                    profile_instance = Docente.objects.get(user_id=user)
                    user_profile_data = DocenteDetailSerializer(profile_instance).data
                except Docente.DoesNotExist:
                    raise serializers.ValidationError(
                        "Perfil de docente no encontrado o incompleto.",
                        code="profile_missing",
                    )
            elif user_type_display == "ADMIN":
                try:
                    profile_instance = Admin.objects.get(user_id=user)
                    user_profile_data = AdminDetailSerializer(profile_instance).data
                except Admin.DoesNotExist:
                    raise serializers.ValidationError(
                        "Perfil de administrador no encontrado o incompleto.",
                        code="profile_missing",
                    )
            else:
                print(
                    f"Advertencia: Tipo de usuario '{user_type_display}' no tiene un perfil específico o no está configurado para el login."
                )
                user_profile_data = {}

            data["profile_data"] = user_profile_data
            data["user_type"] = user_type_display
            data["user_id_global"] = user.user_id

        else:
            raise serializers.ValidationError(
                "Debe incluir 'correo electrónico' y 'contraseña'.",
                code="missing_credentials",
            )

        return data


class EstudianteDetailByCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = [
            "id_estudiante",
            "nombre_estudiante",
            "apellidos_estudiante",
            "ci_estudiante",
        ]
