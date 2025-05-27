from django.db import models
from datetime import timedelta
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from users.models import Admin, Docente

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
    admin_id = models.ForeignKey(Admin,on_delete=models.CASCADE)
    nombre_institucion = models.CharField(max_length=100)
    codigo_institucion = models.CharField(max_length=10, unique=True)
    direccion = models.CharField(max_length=50)
    email_institucion = models.EmailField(max_length=30, help_text="Correo electrónico de la institucion")
    provincia = models.ForeignKey(Provincia, on_delete=models.CASCADE)
    nivel_institucion = models.ForeignKey(NivelEducativo, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Institución"
        verbose_name_plural = "Instituciones"
        ordering = ['nombre_institucion']

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
    modulo_curso = models.ForeignKey(Modulo, on_delete=models.CASCADE)
    idioma_curso = models.ForeignKey(Idioma, on_delete=models.CASCADE)
    dificultad_curso = models.ForeignKey(DificultadCurso, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre_curso

    def calcular_y_actualizar_duracion(self):
        # Calcula la suma de duraciones de todas las secciones
        total_duration = self.secciones.aggregate(total=Sum('duracion_seccion'))['total'] or timedelta(minutes=0)
        if self.duracion_curso != total_duration:
            self.duracion_curso = total_duration
            self.save(update_fields=['duracion_curso'])

class Seccion(models.Model):
    id_seccion = models.AutoField(primary_key=True)
    nombre_seccion = models.CharField(max_length=100)
    descripcion_seccion = models.TextField()
    seccion_del_curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='secciones')
    duracion_seccion = models.DurationField(default=timedelta(minutes=0))
    
    def __str__(self):
        return self.nombre_seccion
class TipoRecurso(models.Model):
    id_tipo_recurso = models.AutoField(primary_key=True)
    tipo_recurso = models.CharField(max_length=30)

    def __str__(self):
        return self.tipo_recurso
    
class Recurso(models.Model):
    id_recurso = models.AutoField(primary_key=True)
    nombre_recurso = models.CharField(max_length=30)
    # url_recurso = models.URLField(max_length=1000)
    url_recurso = models.CharField(max_length=1000)
    archivo_recurso = models.FileField(upload_to='recursos/', null=True, blank=True)
    texto_recurso = models.TextField(null = True, blank=True)
    tipo_recurso = models.ForeignKey(TipoRecurso, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_recurso

@receiver(post_save, sender=Seccion)
def update_curso_duration_on_seccion_save(sender, instance, **kwargs):
    if instance.seccion_del_curso:
        instance.seccion_del_curso.calcular_y_actualizar_duracion()

@receiver(post_delete, sender=Seccion)
def update_curso_duration_on_seccion_delete(sender, instance, **kwargs):
    if instance.seccion_del_curso:
        instance.seccion_del_curso.calcular_y_actualizar_duracion()