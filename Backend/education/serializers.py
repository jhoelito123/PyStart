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
    Comentario,
    InscripcionCurso,
    ProgresoSeccion,
    Certificado,
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
    url_recurso = serializers.URLField(
        max_length=1000, required=False, allow_blank=True, allow_null=True
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

    def update(self, instance, validated_data):
        video_data = validated_data.pop("video_seccion", None)
        if video_data is not None:
            if instance.video_seccion:
                for attr, value in video_data.items():
                    setattr(instance.video_seccion, attr, value)
                instance.video_seccion.save()
            else:
                instance.video_seccion = Recurso.objects.create(**video_data)

        # --- Lógica para contenido_seccion ---
        contenido_data = validated_data.pop("contenido_seccion", None)
        if contenido_data is not None:
            if instance.contenido_seccion:
                for attr, value in contenido_data.items():
                    setattr(instance.contenido_seccion, attr, value)
                instance.contenido_seccion.save()
            else:
                instance.contenido_seccion = Recurso.objects.create(**contenido_data)

        # --- Lógica para instruccion_ejecutor_seccion ---
        instruccion_data = validated_data.pop("instruccion_ejecutor_seccion", None)
        if instruccion_data is not None:
            if instance.instruccion_ejecutor_seccion:
                for attr, value in instruccion_data.items():
                    setattr(instance.instruccion_ejecutor_seccion, attr, value)
                instance.instruccion_ejecutor_seccion.save()
            else:
                instance.instruccion_ejecutor_seccion = Recurso.objects.create(
                    **instruccion_data
                )

        # --- Actualizar campos directos de la instancia de Seccion ---
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


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


class InscripcionCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = InscripcionCurso
        fields = "__all__"

    def validate(self, data):
        estudiante = data["estudiante_inscripcion"]
        curso = data["curso_inscripcion"]
        if InscripcionCurso.objects.filter(
            estudiante_inscripcion=estudiante, curso_inscripcion=curso
        ).exists():
            raise serializers.ValidationError("Ya estás inscrito en este curso.")
        return data


class ProgresoInscripcionSerializer(serializers.ModelSerializer):
    nombre_curso = serializers.CharField(source="curso_inscripcion.nombre_curso")

    class Meta:
        model = InscripcionCurso
        fields = [
            "id_inscripcion",
            "nombre_curso",
            "porcentaje_progreso",
            "completado",
            "fecha_inscripcion",
        ]

class ProgresoSeccionSerializer(serializers.ModelSerializer):

    estudiante_id = serializers.PrimaryKeyRelatedField(
        queryset=Estudiante.objects.all(), source='estudiante', write_only=True
    )
    seccion_id = serializers.PrimaryKeyRelatedField(
        queryset=Seccion.objects.all(), source='seccion', write_only=True
    )

    class Meta:
        model = ProgresoSeccion
        fields = [
            'id_progreso_seccion',
            'estudiante_id', 
            'seccion_id',
            'from_inscripcion',
            'fecha_completado'
        ]
        read_only_fields = [
            'id_progreso_seccion',
            'fecha_completado',
            'from_inscripcion',
            'estudiante', 
            'seccion'
        ]

    def create(self, validated_data):
        estudiante = validated_data.pop('estudiante')
        seccion = validated_data.pop('seccion')

        # Buscamos la InscripcionCurso que coincida con el estudiante y el curso de la sección
        try:
            inscripcion = InscripcionCurso.objects.get(
                estudiante_inscripcion=estudiante,
                curso_inscripcion=seccion.seccion_del_curso
            )
        except InscripcionCurso.DoesNotExist:
            raise serializers.ValidationError(
                "No se encontró una inscripción activa para este estudiante en el curso de esta sección."
            )

        # Crear la instancia de ProgresoSeccion
        progreso_seccion = ProgresoSeccion.objects.create(
            estudiante=estudiante,
            seccion=seccion,
            from_inscripcion=inscripcion,
            **validated_data
        )
        return progreso_seccion

    # Validar que el estudiante no haya completado ya esta sección
    def validate(self, data):
        estudiante = data.get('estudiante')
        seccion = data.get('seccion')

        if ProgresoSeccion.objects.filter(estudiante=estudiante, seccion=seccion).exists():
            raise serializers.ValidationError(
                {"detail": "Este estudiante ya ha marcado esta sección como completada."}
            )
        return data

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


class PreguntaQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaQuiz
        fields = ["pregunta", "opciones", "opcion_correcta"]


class QuizSerializer(serializers.ModelSerializer):
    preguntas = PreguntaQuizSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ["nombre_quiz", "curso", "puntaje_quiz", "preguntas"]

    def create(self, validated_data):
        preguntas_data = validated_data.pop("preguntas")
        quiz = Quiz.objects.create(**validated_data)

        for pregunta_data in preguntas_data:
            PreguntaQuiz.objects.create(quiz=quiz, **pregunta_data)

        return quiz


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
    autor_comentario = serializers.PrimaryKeyRelatedField(
        queryset=Estudiante.objects.all()
    )
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())

    autor_nombre = serializers.CharField(
        source="autor_comentario.user_id.username_user", read_only=True
    )
    nombre_curso = serializers.CharField(source="curso.nombre_curso", read_only=True)

    class Meta:
        model = Comentario
        fields = [
            "id_comentario",
            "autor_comentario",
            "autor_nombre",
            "contenido_comentario",
            "curso",
            "nombre_curso",
            "puntuacion_curso",
            "fecha_creacion_comentario",
        ]


class ComentarioDetailSerializer(serializers.ModelSerializer):
    autor_comentario = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comentario
        fields = "__all__"

class CertificadoSerializer(serializers.ModelSerializer):
    inscripcion_id = serializers.PrimaryKeyRelatedField(
        queryset=InscripcionCurso.objects.all(),
        source='certificado_de_inscripcion',
        write_only=True,
        help_text="ID de la inscripción a la que pertenece este certificado."
    )

    class Meta:
        model = Certificado
        fields = [
            'id_certificado',
            'inscripcion_id',
            'url_certificado',
            'fecha_emision_certificado',
            'certificado_de_inscripcion',
        ]
        read_only_fields = [
            'id_certificado',
            'fecha_emision_certificado',
            'certificado_de_inscripcion', 
        ]