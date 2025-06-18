from django.test import TransactionTestCase, TestCase
from django.urls import reverse
from django.db import IntegrityError
from education.models import (
    Departamento,
    Provincia,
    NivelEducativo,
    Modulo,
    Idioma,
    DificultadCurso,
    TipoRecurso,
    Institucion,
)
from users.models import Usuario, Admin, Docente


class EducationModelsTest(TestCase):
    def setUp(self):
        # 1. Crear un Usuario base (necesario para Admin y Docente)
        self.user = Usuario.objects.create(
            username_user="testuser_edu",
            password_user="pass123",
            email_user="test_edu@example.com",
            is_active=True,
        )
        self.user2 = Usuario.objects.create(
            username_user="anotheruser_edu",
            password_user="anotherpass123",
            email_user="another_edu@example.com",
            is_active=True,
        )

        # 2. Crear un Admin
        self.admin = Admin.objects.create(user_id=self.user)

        # 3. Crear un Docente
        self.docente = Docente.objects.create(
            user_id=self.user2,
            nombre_docente="Profesor",
            apellidos_docente="Javier",
            ci_docente="11223344",
            telefono_docente=987654321,
        )

        # 4. Crear instancias de modelos base para FKs
        self.nivel_educativo = NivelEducativo.objects.create(nivel_educativo="Superior")
        self.modulo = Modulo.objects.create(nombre_modulo="Matemáticas")
        self.idioma = Idioma.objects.create(idioma="Español")
        self.dificultad = DificultadCurso.objects.create(dificultad_curso="Intermedio")
        self.tipo_recurso = TipoRecurso.objects.create(tipo_recurso="Video")


class NivelEducativoModelTest(EducationModelsTest):
    def test_create_nivel_educativo_successfully(self):
        nivel = NivelEducativo.objects.create(nivel_educativo="Primario")
        self.assertIsNotNone(nivel.id_nivel_educativo)
        self.assertEqual(nivel.nivel_educativo, "Primario")
        self.assertEqual(str(nivel), "Primario")


class ModuloModelTest(EducationModelsTest):
    def test_create_modulo_successfully(self):
        modulo = Modulo.objects.create(nombre_modulo="Programación")
        self.assertIsNotNone(modulo.id_modulo)
        self.assertEqual(modulo.nombre_modulo, "Programación")
        self.assertEqual(str(modulo), "Programación")


class IdiomaModelTest(EducationModelsTest):
    def test_create_idioma_successfully(self):
        idioma = Idioma.objects.create(idioma="Inglés")
        self.assertIsNotNone(idioma.id_idioma)
        self.assertEqual(idioma.idioma, "Inglés")
        self.assertEqual(str(idioma), "Inglés")


class DificultadCursoModelTest(EducationModelsTest):
    def test_create_dificultad_successfully(self):
        dificultad = DificultadCurso.objects.create(dificultad_curso="Avanzado")
        self.assertIsNotNone(dificultad.id_dificultad)
        self.assertEqual(dificultad.dificultad_curso, "Avanzado")
        self.assertEqual(str(dificultad), "Avanzado")


class TipoRecursoModelTest(EducationModelsTest):
    def test_create_tipo_recurso_successfully(self):
        tipo = TipoRecurso.objects.create(tipo_recurso="PeDF")
        self.assertIsNotNone(tipo.id_tipo_recurso)
        self.assertEqual(tipo.tipo_recurso, "PeDF")
        self.assertEqual(str(tipo), "PeDF")
