from django.db import models
from datetime import timedelta
from django.db.models import Sum, Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from users.models import Admin, Docente, Estudiante


class Departamento(models.Model):
    id_departamento = models.AutoField(primary_key=True)
    nombre_departamento = models.CharField(max_length=100)
    nombre_corto = models.CharField(max_length=10)

    def __str__(self):
        return self.nombre_departamento


class Provincia(models.Model):
    id_provincia = models.AutoField(primary_key=True)
    nombre_provincia = models.CharField(max_length=150)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_provincia


class NivelEducativo(models.Model):
    id_nivel_educativo = models.AutoField(primary_key=True)
    nivel_educativo = models.CharField(max_length=20)

    def __str__(self):
        return self.nivel_educativo


class Institucion(models.Model):
    id_institucion = models.AutoField(primary_key=True)
    admin_id = models.ForeignKey(Admin, on_delete=models.CASCADE)
    nombre_institucion = models.CharField(max_length=100)
    codigo_institucion = models.CharField(max_length=10, unique=True)
    direccion = models.CharField(max_length=50)
    email_institucion = models.EmailField(
        max_length=30, help_text="Correo electrónico de la institucion"
    )
    provincia = models.ForeignKey(Provincia, on_delete=models.CASCADE)
    nivel_institucion = models.ForeignKey(NivelEducativo, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Institución"
        verbose_name_plural = "Instituciones"
        ordering = ["nombre_institucion"]

    def __str__(self):
        return self.nombre_institucion


class Modulo(models.Model):
    id_modulo = models.AutoField(primary_key=True)
    nombre_modulo = models.CharField(max_length=40)

    def __str__(self):
        return self.nombre_modulo


class Idioma(models.Model):
    id_idioma = models.AutoField(primary_key=True)
    idioma = models.CharField(max_length=40)

    def __str__(self):
        return self.idioma


class DificultadCurso(models.Model):
    id_dificultad = models.AutoField(primary_key=True)
    dificultad_curso = models.CharField(max_length=40)

    def __str__(self):
        return self.dificultad_curso


class Curso(models.Model):
    id_curso = models.AutoField(primary_key=True)
    nombre_curso = models.CharField(max_length=100)
    profesor_curso = models.ForeignKey(Docente, on_delete=models.CASCADE)
    calificacion_curso = models.FloatField(default=0.0)
    duracion_curso = models.DurationField(default=timedelta(minutes=0))
    descripcion_curso = models.TextField()
    portada_curso = models.URLField(max_length=1000)
    fecha_inicio_curso = models.DateField()
    fecha_cierre_curso = models.DateField()
    modulo_curso = models.ForeignKey(
        Modulo, on_delete=models.SET_NULL, null=True, blank=True
    )
    idioma_curso = models.ForeignKey(
        Idioma, on_delete=models.SET_NULL, null=True, blank=True
    )
    dificultad_curso = models.ForeignKey(
        DificultadCurso, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.nombre_curso

    def calcular_y_actualizar_duracion(self):
        # Calcula la suma de duraciones de todas las secciones
        total_duration = self.secciones.aggregate(total=Sum("duracion_seccion"))[
            "total"
        ] or timedelta(minutes=0)
        if self.duracion_curso != total_duration:
            self.duracion_curso = total_duration
            self.save(update_fields=["duracion_curso"])

    def actualizar_calificacion_curso(self):
        # Calcula el promedio de las puntuaciones de todos los comentarios de ese curso
        promedio = self.comentarios_curso.aggregate(Avg("puntuacion_curso"))[
            "puntuacion_curso__avg"
        ]

        nueva_calificacion = round(promedio, 2) if promedio is not None else 0.0
        if self.calificacion_curso != nueva_calificacion:
            self.calificacion_curso = nueva_calificacion
            self.save(update_fields=["calificacion_curso"])


class EstudianteInstitucion(models.Model):
    id_estudiante_institucion = models.AutoField(primary_key=True)
    institucion_id = models.ForeignKey(Institucion, on_delete=models.PROTECT)
    estudiante_id = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("institucion_id", "estudiante_id")

    def __str__(self):
        return f"Estudiante {self.estudiante_id.user_id.username_user} en Institución {self.institucion_id.nombre_institucion}"


class InscripcionCurso(models.Model):
    id_inscripcion = models.AutoField(primary_key=True)
    estudiante_inscripcion = models.ForeignKey(
        "users.Estudiante", on_delete=models.CASCADE
    )
    curso_inscripcion = models.ForeignKey("Curso", on_delete=models.CASCADE)
    fecha_inscripcion = models.DateField(auto_now_add=True)
    porcentaje_progreso = models.FloatField(
        default=0.0, help_text="Porcentaje de secciones completadas en este curso."
    )
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.estudiante} en {self.curso}"

    def recalcular_progreso(self):
        total_secciones = self.curso_inscripcion.secciones.count()
        secciones_completadas = self.estudiante_inscripcion.progreso_secciones.filter(
            seccion__curso=self.curso_inscripcion
        ).count()

        if total_secciones > 0:
            nuevo_porcentaje = (secciones_completadas / total_secciones) * 100
        else:
            nuevo_porcentaje = 0.0

        if nuevo_porcentaje >= 100 and not self.completado:
            self.completado = True
        elif nuevo_porcentaje < 100 and self.completado:
            self.completado = False

        if (
            self.porcentaje_progreso != nuevo_porcentaje or self.completado_changed
        ):  # pseudocódigo
            self.porcentaje_progreso = round(nuevo_porcentaje, 2)
            self.save(update_fields=["porcentaje_progreso", "completado"])


class TipoRecurso(models.Model):
    id_tipo_recurso = models.AutoField(primary_key=True)
    tipo_recurso = models.CharField(max_length=30)

    def __str__(self):
        return self.tipo_recurso


class Recurso(models.Model):
    id_recurso = models.AutoField(primary_key=True)
    nombre_recurso = models.CharField(max_length=100)
    url_recurso = models.URLField(null=True, max_length=1000)
    texto_recurso = models.TextField(null=True, blank=True)
    tipo_recurso = models.ForeignKey(TipoRecurso, on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre_recurso


class Seccion(models.Model):
    id_seccion = models.AutoField(primary_key=True)
    nombre_seccion = models.CharField(max_length=100)
    descripcion_seccion = models.TextField()
    seccion_del_curso = models.ForeignKey(
        Curso, on_delete=models.CASCADE, related_name="secciones"
    )
    duracion_seccion = models.DurationField(default=timedelta(minutes=0))
    video_seccion = models.ForeignKey(
        Recurso, on_delete=models.SET_NULL, null=True, blank=True, related_name="video"
    )
    contenido_seccion = models.ForeignKey(
        Recurso,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contenido",
    )
    instruccion_ejecutor_seccion = models.ForeignKey(
        Recurso,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="instruccion",
    )

    def __str__(self):
        return self.nombre_seccion


class ProgresoSeccion(models.Model):
    id_progreso_seccion = models.AutoField(primary_key=True)
    estudiante = models.ForeignKey(
        Estudiante, on_delete=models.CASCADE, related_name="progreso_secciones"
    )
    seccion = models.ForeignKey(
        Seccion, on_delete=models.CASCADE, related_name="progreso_estudiantes"
    )
    fecha_completado = models.DateTimeField(
        auto_now_add=True, help_text="Fecha y hora en que la sección fue completada."
    )

    class Meta:
        unique_together = ("estudiante", "seccion")
        verbose_name = "Progreso de Sección"
        verbose_name_plural = "Progreso de Secciones"

    def __str__(self):
        return f"Progreso de {self.estudiante.user_id.username_user} en {self.seccion.titulo_seccion}"


class Quiz(models.Model):
    id_quiz = models.AutoField(primary_key=True)
    nombre_quiz = models.CharField(max_length=100)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name="quizzes")
    puntaje_quiz = models.IntegerField()

    def __str__(self):
        return f"{self.nombre_quiz} (Curso: {self.curso.nombre_curso})"


class PreguntaQuiz(models.Model):
    id_pregunta_quiz = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="preguntas")
    pregunta = models.CharField(max_length=150)
    opciones = (
        models.JSONField()
    )  # Requiere Django 3.1+ y PostgreSQL, si no usa TextField
    opcion_correcta = models.IntegerField(help_text="Índice de la opción correcta")

    def __str__(self):
        return self.pregunta


class FeedbackSeccion(models.Model):
    id_feedback = models.AutoField(primary_key=True)
    from_seccion = models.ForeignKey(Seccion, on_delete=models.CASCADE)
    contenido_feedback = models.TextField()
    fecha_feedback = models.DateTimeField(auto_now_add=True)
    autor_feedback = models.ForeignKey(Estudiante, on_delete=models.CASCADE)

    def __str__(self):
        return self.contenido_feedback


class Comentario(models.Model):
    id_comentario = models.AutoField(primary_key=True)
    autor_comentario = models.ForeignKey(Estudiante, on_delete=models.CASCADE)
    contenido_comentario = models.TextField()
    curso = models.ForeignKey(
        Curso, on_delete=models.CASCADE, related_name="comentarios_curso"
    )
    puntuacion_curso = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        help_text="Puntuación del curso (1 a 5 estrellas).",
    )
    fecha_creacion_comentario = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.autor_comentario}: {self.contenido_comentario}"

    class Meta:
        verbose_name = "Comentario de Curso"
        verbose_name_plural = "Comentarios de Curso"


# SIGNALS for models
@receiver(post_save, sender=Seccion)
def update_curso_duration_on_seccion_save(sender, instance, **kwargs):
    if instance.seccion_del_curso:
        instance.seccion_del_curso.calcular_y_actualizar_duracion()


@receiver(post_delete, sender=Seccion)
def update_curso_duration_on_seccion_delete(sender, instance, **kwargs):
    if instance.seccion_del_curso:
        instance.seccion_del_curso.calcular_y_actualizar_duracion()


@receiver(post_save, sender=Comentario)
def comentario_creado_o_actualizado(sender, instance, created, **kwargs):
    if instance.curso:
        instance.curso.actualizar_calificacion_curso()


@receiver(post_delete, sender=Comentario)
def comentario_eliminado(sender, instance, **kwargs):
    if instance.curso:
        instance.curso.actualizar_calificacion_curso()


@receiver(post_save, sender=ProgresoSeccion)
def progreso_seccion_creado_o_actualizado(sender, instance, created, **kwargs):
    estudiante = instance.estudiante
    curso = instance.seccion.curso
    try:
        inscripcion = InscripcionCurso.objects.get(
            estudiante_inscripcion=estudiante, curso_inscripcion=curso
        )
        inscripcion.recalcular_progreso()
    except InscripcionCurso.DoesNotExist:
        print(
            f"Advertencia: No se encontró InscripcionCurso para estudiante {estudiante.user_id.username_user} y curso {curso.nombre_curso} al actualizar progreso."
        )
