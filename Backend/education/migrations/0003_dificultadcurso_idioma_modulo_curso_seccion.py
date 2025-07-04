# Generated by Django 5.2 on 2025-05-26 16:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("education", "0002_auto_20250523_1704"),
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="DificultadCurso",
            fields=[
                ("id_dificultad", models.AutoField(primary_key=True, serialize=False)),
                ("dificultad_curso", models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name="Idioma",
            fields=[
                ("id_idioma", models.AutoField(primary_key=True, serialize=False)),
                ("idioma", models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name="Modulo",
            fields=[
                ("id_modulo", models.AutoField(primary_key=True, serialize=False)),
                ("nombre_modulo", models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name="Curso",
            fields=[
                ("id_curso", models.AutoField(primary_key=True, serialize=False)),
                ("nombre_curso", models.CharField(max_length=30)),
                ("calificacion_curso", models.FloatField()),
                ("duracion_curso", models.TimeField()),
                ("descripcion_curso", models.TextField()),
                ("portada_curso", models.URLField()),
                ("fecha_inicio_curso", models.DateField()),
                ("fecha_cierre_curso", models.DateField()),
                (
                    "profesor_curso",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="users.docente"
                    ),
                ),
                (
                    "dificultad_curso",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="education.dificultadcurso",
                    ),
                ),
                (
                    "idioma_curso",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="education.idioma",
                    ),
                ),
                (
                    "modulo_curso",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="education.modulo",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Seccion",
            fields=[
                ("id_seccion", models.AutoField(primary_key=True, serialize=False)),
                ("nombre_seccion", models.CharField(max_length=30)),
                ("descripcion_seccion", models.TextField()),
                (
                    "seccion_del_curso",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="education.curso",
                    ),
                ),
            ],
        ),
    ]
