# Generated by Django 5.2 on 2025-06-30 04:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("education", "0016_inscripcioncurso_porcentaje_progreso_progresoseccion"),
    ]

    operations = [
        migrations.AddField(
            model_name="progresoseccion",
            name="from_inscripcion",
            field=models.CharField(default="", max_length=10),
        ),
    ]
