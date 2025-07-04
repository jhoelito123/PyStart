# Generated by Django 5.2 on 2025-06-19 02:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("education", "0009_quiz_preguntaquiz"),
        ("users", "0003_usuario_tipo_de_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="FeedbackSeccion",
            fields=[
                ("id_feedback", models.AutoField(primary_key=True, serialize=False)),
                ("contenido_feedback", models.TextField()),
                ("fecha_feedback", models.DateTimeField()),
                (
                    "autor_feedback",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="users.estudiante",
                    ),
                ),
                (
                    "from_seccion",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="education.seccion",
                    ),
                ),
            ],
        ),
    ]
