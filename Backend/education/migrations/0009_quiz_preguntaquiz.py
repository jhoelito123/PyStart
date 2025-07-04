# Generated by Django 5.2 on 2025-06-18 23:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("education", "0008_remove_recurso_archivo_recurso_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Quiz",
            fields=[
                ("id_quiz", models.AutoField(primary_key=True, serialize=False)),
                ("nombre_quiz", models.CharField(max_length=100)),
                ("puntaje_quiz", models.IntegerField()),
                (
                    "curso",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="quizzes",
                        to="education.curso",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PreguntaQuiz",
            fields=[
                (
                    "id_pregunta_quiz",
                    models.AutoField(primary_key=True, serialize=False),
                ),
                ("pregunta", models.CharField(max_length=150)),
                ("opciones", models.JSONField()),
                (
                    "opcion_correcta",
                    models.IntegerField(help_text="Índice de la opción correcta"),
                ),
                (
                    "quiz",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="preguntas",
                        to="education.quiz",
                    ),
                ),
            ],
        ),
    ]
