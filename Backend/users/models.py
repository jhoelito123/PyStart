from django.db import models


class TipoUsuario(models.Model):
    id_tipo_usuario = models.AutoField(primary_key=True, help_text="ID tipo user")
    tipo_usuario = models.CharField(max_length=15)

    class Meta:
        verbose_name = "Tipo de Usuario"
        verbose_name_plural = "Tipos de Usuarios"

    def __str__(self):
        return self.tipo_usuario


class Usuario(models.Model):
    user_id = models.AutoField(primary_key=True, help_text="Identificador de usuario")
    tipo_de_user = models.ForeignKey(TipoUsuario, default=2, on_delete=models.PROTECT)
    username_user = models.CharField(max_length=30, help_text="Nombre de usuario")
    password_user = models.CharField(max_length=130, help_text="Contraseña del usuario")
    email_user = models.EmailField(
        max_length=30, unique=True, help_text="Correo electrónico del usuario."
    )
    is_active = models.BooleanField(
        default=True, help_text="Indica si la cuenta del usuario está activa"
    )
    date_joined = models.DateTimeField(
        auto_now_add=True, help_text="Fecha y hora de registro del usuario"
    )
    last_login = models.DateTimeField(
        null=True, blank=True, help_text="Fecha y hora del último inicio de sesión"
    )


class Admin(models.Model):
    # Modelo para representar a los administradores del sistema.
    user_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    admin_id = models.AutoField(
        primary_key=True, help_text="Identificador único del administrador."
    )

    class Meta:
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"

    def __str__(self):
        return self.user_id.username_user


class Estudiante(models.Model):
    # Modelo para representar a los estudiantes del sistema.
    user_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_estudiante = models.AutoField(
        primary_key=True, help_text="Identificador único del estudiante."
    )
    nombre_estudiante = models.CharField(
        max_length=30, help_text="Nombre del estudiante."
    )
    apellidos_estudiante = models.CharField(
        max_length=30, help_text="Apellidos del estudiante."
    )
    ci_estudiante = models.CharField(
        max_length=9,
        unique=True,
        help_text="Número de cédula de identidad único del estudiante.",
    )

    class Meta:
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"

    def __str__(self):
        return f"{self.nombre_estudiante} {self.apellidos_estudiante}"


class Docente(models.Model):
    # Modelo para representar a los estudiantes del sistema.
    user_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_docente = models.AutoField(
        primary_key=True, help_text="Identificador único del docente."
    )
    nombre_docente = models.CharField(max_length=30, help_text="Nombre del docente.")
    apellidos_docente = models.CharField(
        max_length=30, help_text="Apellidos del docente."
    )
    ci_docente = models.CharField(
        max_length=9,
        unique=True,
        help_text="Número de cédula de identidad único del docente.",
    )
    telefono_docente = models.IntegerField(help_text="Número de elular del docente")

    class Meta:
        verbose_name = "Docente"
        verbose_name_plural = "Docentes"

    def __str__(self):
        return f"{self.nombre_docente} {self.apellidos_docente}"
