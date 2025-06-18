from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from datetime import timedelta
from django.utils import timezone

from users.models import Usuario, Admin, Estudiante, Docente


class UsuarioModelTest(TestCase):

    def setUp(self):
        self.user_data = {
            "username_user": "testuser",
            "password_user": "securepassword123",
            "email_user": "correito@example.com",
            "is_active": True,
        }

    def test_create_usuario_successfully(self):
        # Test positivo
        user = Usuario.objects.create(**self.user_data)
        self.assertEqual(Usuario.objects.count(), 1)
        self.assertEqual(user.username_user, "testuser")
        self.assertEqual(user.email_user, "correito@example.com")
        self.assertTrue(user.is_active)
        self.assertIsNotNone(user.date_joined)
        self.assertIsNone(user.last_login)  # test negativo: correo duplicado

    def test_email_max_length_validation(self):
        # longitud máxima del correo electrónico
        invalid_email = "a" * 25 + "@example.com"
        user_data = self.user_data.copy()
        user_data["email_user"] = invalid_email

        user_obj = Usuario(**user_data)
        with self.assertRaises(ValidationError):
            user_obj.full_clean()

    def test_last_login_update(self):
        # last login actualizado correctamente
        user = Usuario.objects.create(**self.user_data)
        now = timezone.now()
        user.last_login = now
        user.save()
        user.refresh_from_db()  # Recargar el objeto desde la DB para asegurar
        self.assertAlmostEqual(user.last_login, now, delta=timedelta(seconds=1))


class AdminModelTest(TestCase):
    def setUp(self):
        # usuario para asociarlo al admin
        self.user = Usuario.objects.create(
            username_user="adminuser",
            password_user="adminpass",
            email_user="admin@example.com",
        )

    def test_create_admin_successfully(self):
        # test positivo: creación de admin
        admin = Admin.objects.create(user_id=self.user)
        self.assertEqual(Admin.objects.count(), 1)
        self.assertEqual(admin.user_id, self.user)
        self.assertIsNotNone(admin.admin_id)

    def test_delete_usuario_cascades_admin(self):
        # si se elimina el usuario, el admin también se elimina con cascada
        admin = Admin.objects.create(user_id=self.user)
        self.assertEqual(Admin.objects.count(), 1)
        self.user.delete()
        self.assertEqual(Admin.objects.count(), 0)  # El admin debería haberse eliminado


class EstudianteModelTest(TestCase):
    # Tests para el modelo Estudiante.
    def setUp(self):
        self.user = Usuario.objects.create(
            username_user="studentuser",
            password_user="studentpass",
            email_user="student@example.com",
        )
        self.estudiante_data = {
            "user_id": self.user,
            "nombre_estudiante": "Juan",
            "apellidos_estudiante": "Perez",
            "ci_estudiante": "1234567",
        }

    def test_create_estudiante_successfully(self):
        # test positivo: creación de estudiante
        estudiante = Estudiante.objects.create(**self.estudiante_data)
        self.assertEqual(Estudiante.objects.count(), 1)
        self.assertEqual(estudiante.nombre_estudiante, "Juan")
        self.assertEqual(estudiante.ci_estudiante, "1234567")

    def test_ci_max_length_validation(self):
        # longitud máxima del CI
        invalid_ci = "1" * 10  # 10 caracteres, max_length es 9
        estudiante_data = self.estudiante_data.copy()
        estudiante_data["ci_estudiante"] = invalid_ci

        estudiante_obj = Estudiante(**estudiante_data)
        with self.assertRaises(ValidationError):
            estudiante_obj.full_clean()


class DocenteModelTest(TestCase):
    # Tests para el modelo Docente.
    def setUp(self):
        self.user = Usuario.objects.create(
            username_user="teacheruser",
            password_user="teacherpass",
            email_user="teacher@example.com",
        )
        self.docente_data = {
            "user_id": self.user,
            "nombre_docente": "Richard",
            "apellidos_docente": "Ayoroa",
            "ci_docente": "7654321",
            "telefono_docente": 78901234,
        }

    def test_create_docente_successfully(self):
        # test positivo: creación de docente
        docente = Docente.objects.create(**self.docente_data)
        self.assertEqual(Docente.objects.count(), 1)
        self.assertEqual(docente.nombre_docente, "Richard")
        self.assertEqual(docente.ci_docente, "7654321")
        self.assertEqual(
            docente.telefono_docente, 78901234
        )  # test negativo: CI duplicado
