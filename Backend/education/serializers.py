from rest_framework import serializers
from .models import (
    Departamento,
    Provincia,
    NivelEducativo,
    Institucion,
    Modulo,
    Idioma,
    DificultadCurso,
    Curso,
    Seccion,
    TipoRecurso,
    Recurso,
    Quiz,
    PreguntaQuiz,
    FeedbackSeccion,
    Comentario
)
from users.models import Estudiante


class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = "__all__"  # todos los atributos del modelo


class TipoRecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRecurso
        fields = ["id_tipo_recurso", "tipo_recurso"]


class RecursoSerializer(serializers.ModelSerializer):
    tipo_recurso = serializers.PrimaryKeyRelatedField(
        queryset=TipoRecurso.objects.all()
    )

    class Meta:
        model = Recurso
        fields = [
            "id_recurso",
            "nombre_recurso",
            "url_recurso",
            "texto_recurso",
            "tipo_recurso",
        ]


class SeccionSerializer(serializers.ModelSerializer):
    # Para crear recursos anidados en POST
    video_seccion = RecursoSerializer(required=False, allow_null=True)
    contenido_seccion = RecursoSerializer(required=False, allow_null=True)
    instruccion_ejecutor_seccion = RecursoSerializer(required=False, allow_null=True)
    seccion_del_curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())

    class Meta:
        model = Seccion
        fields = [
            "id_seccion",
            "nombre_seccion",
            "descripcion_seccion",
            "seccion_del_curso",
            "duracion_seccion",
            "video_seccion",
            "contenido_seccion",
            "instruccion_ejecutor_seccion",
        ]

    def create(self, validated_data):
        video_data = validated_data.pop("video_seccion", None)
        contenido_data = validated_data.pop("contenido_seccion", None)
        instruccion_data = validated_data.pop("instruccion_ejecutor_seccion", None)

        seccion = Seccion.objects.create(**validated_data)

        if video_data:
            video = Recurso.objects.create(**video_data)
            seccion.video_seccion = video

        if contenido_data:
            contenido = Recurso.objects.create(**contenido_data)
            seccion.contenido_seccion = contenido

        if instruccion_data:
            instruccion = Recurso.objects.create(**instruccion_data)
            seccion.instruccion_ejecutor_seccion = instruccion

        seccion.save()
        return seccion


class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = "__all__"


class NivelEducativoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelEducativo
        fields = "__all__"


class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = [
            "id_institucion",
            "admin_id",  # DRF manejará la búsqueda del Admin por este ID
            "nombre_institucion",
            "codigo_institucion",
            "direccion",
            "email_institucion",
            "provincia",
            "nivel_institucion",
        ]
        read_only_fields = ["id_institucion"]


class ModuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modulo
        fields = "__all__"


class IdiomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Idioma
        fields = "__all__"


class DificultadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DificultadCurso
        fields = "__all__"


class CursoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = [
            "id_curso",
            "nombre_curso",
            "profesor_curso",  # Docente por este ID
            "duracion_curso",
            "descripcion_curso",
            "portada_curso",
            "fecha_inicio_curso",
            "fecha_cierre_curso",
            "calificacion_curso",
            "duracion_curso",
            "modulo_curso",
            "idioma_curso",
            "dificultad_curso",
        ]
        read_only_fields = ["id_curso", "calificacion_curso", "duracion_curso"]


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = "__all__"


class SeccionesParaCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seccion
        fields = ["id_seccion", "nombre_seccion", "descripcion_seccion"]


class CursoDetalleSerializer(serializers.ModelSerializer):
    idioma = serializers.CharField(source="idioma_curso.idioma", read_only=True)
    dificultad = serializers.CharField(
        source="dificultad_curso.dificultad_curso", read_only=True
    )
    modulo = serializers.CharField(source="modulo_curso.nombre_modulo", read_only=True)
    profesor = serializers.CharField(
        source="profesor_curso.nombre_docente", read_only=True
    )
    secciones = SeccionesParaCursoSerializer(many=True, read_only=True)

    class Meta:
        model = Curso
        fields = [
            "id_curso",
            "nombre_curso",
            "descripcion_curso",
            "fecha_inicio_curso",
            "duracion_curso",
            "portada_curso",
            "idioma",
            "dificultad",
            "modulo",
            "profesor",
            "secciones",
        ]


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = "__all__"


class PreguntaQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaQuiz
        fields = "__all__"


class FeedbackSerializer(serializers.ModelSerializer):
    from_seccion = serializers.PrimaryKeyRelatedField(queryset=Seccion.objects.all())
    autor_feedback = serializers.PrimaryKeyRelatedField(
        queryset=Estudiante.objects.all()
    )

    # NUEVO: Campo de lectura para mostrar el nombre de la sección
    nombre_seccion = serializers.CharField(
        source="from_seccion.nombre_seccion", read_only=True
    )

    autor_nombre = serializers.CharField(
        source="autor_feedback.user_id.username_user", read_only=True
    )

    class Meta:
        model = FeedbackSeccion
        fields = [
            "id_feedback",
            "from_seccion",
            "nombre_seccion",
            "contenido_feedback",
            "fecha_feedback",
            "autor_feedback",
            "autor_nombre",
        ]
        read_only_fields = ["id_feedback", "nombre_seccion", "autor_nombre"]


class CodeExecutionInputSerializer(serializers.Serializer):
    code = serializers.CharField(
        style={"base_template": "textarea.html"},
        help_text="El código Python a ejecutar.",
    )
    language = serializers.CharField(
        max_length=50, help_text="El lenguaje de programación es python."
    )


# Serializer para la salida de datos del ejecutor de código
class CodeExecutionOutputSerializer(serializers.Serializer):
    output = serializers.CharField(
        help_text="La salida estándar (stdout) y/o errores (stderr) de la ejecución del código."
    )
    status = serializers.CharField(
        max_length=20,
        help_text="El estado de la ejecución (e.g., 'success', 'error', 'timeout').",
    )
    error_message = serializers.CharField(
        required=False,
        allow_null=True,
        help_text="Mensaje de error detallado si la ejecución falló.",
    )
    error_type = serializers.CharField(
        required=False,
        allow_null=True,
        max_length=50,
        help_text="Tipo de error (e.g., 'SyntaxError', 'TimeoutError').",
    )


class ComentarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['autor_comentario', 'contenido_comentario', 'curso']


class ComentarioDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'