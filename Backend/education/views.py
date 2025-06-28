from django.shortcuts import render
from django.http import Http404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

import subprocess
import tempfile
import os
import re
from datetime import timedelta  # Necesario si usas DurationField en modelos
from django.db.models import Sum
from .models import (
    Departamento,
    Provincia,
    NivelEducativo,
    Institucion,
    Modulo,
    Idioma,
    DificultadCurso,
    Curso,
    InscripcionCurso,
    TipoRecurso,
    Seccion,
    Recurso,
    Quiz,
    PreguntaQuiz,
    FeedbackSeccion,
    Comentario,
)
from users import models
from .serializers import (
    CodeExecutionInputSerializer,
    CodeExecutionOutputSerializer,
    DepartamentoSerializer,
    ProvinciaSerializer,
    NivelEducativoSerializer,
    InstitucionSerializer,
    ModuloSerializer,
    IdiomaSerializer,
    DificultadSerializer,
    CursoCreateSerializer,
    CursoSerializer,
    InscripcionCursoSerializer,
    ProgresoInscripcionSerializer,
    CursoDetalleSerializer,
    TipoRecursoSerializer,
    RecursoSerializer,
    SeccionSerializer,
    PreguntaQuizSerializer,
    QuizSerializer,
    FeedbackSerializer,
    ComentarioCreateSerializer,
    ComentarioDetailSerializer,
)


class DepartamentoList(generics.ListAPIView):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer


class DepartamentoDetail(generics.RetrieveAPIView):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer


class ProvinciaList(generics.ListAPIView):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer


class ProvinciaDetail(generics.RetrieveAPIView):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer


class ProvinciasPorDepartamento(generics.ListAPIView):
    serializer_class = ProvinciaSerializer

    def get_queryset(self):
        departamento_id = self.kwargs["departamento_id"]
        return Provincia.objects.filter(departamento_id=departamento_id)


class NivelAcademicoList(generics.ListAPIView):
    queryset = NivelEducativo.objects.all()
    serializer_class = NivelEducativoSerializer


class InstitucionCreateView(generics.CreateAPIView):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer


class ModuloDetail(generics.ListAPIView):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer


class IdiomaDetail(generics.ListAPIView):
    queryset = Idioma.objects.all()
    serializer_class = IdiomaSerializer


# GET de todos los TipoRecurso
class TipoRecursoList(generics.ListAPIView):
    queryset = TipoRecurso.objects.all()
    serializer_class = TipoRecursoSerializer


# POST de Seccion (con creación de recursos) y GET all secciones por curso
class SeccionViewSet(viewsets.ModelViewSet):
    queryset = Seccion.objects.all()
    serializer_class = SeccionSerializer

    # GET todas las secciones por ID curso
    def list(self, request, *args, **kwargs):
        curso_id = request.query_params.get("curso_id")
        if curso_id:
            queryset = Seccion.objects.filter(seccion_del_curso_id=curso_id)
        else:
            queryset = self.queryset.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# GET de todos los recursos por ID sección
class RecursosBySeccion(generics.ListAPIView):
    serializer_class = RecursoSerializer

    def get_queryset(self):
        seccion_id = self.kwargs.get("seccion_id")
        try:
            seccion = Seccion.objects.get(pk=seccion_id)
        except Seccion.DoesNotExist:
            raise Http404("La sección no existe")
        recursos_ids = filter(
            None,
            [
                seccion.video_seccion_id,
                seccion.contenido_seccion_id,
                seccion.instruccion_ejecutor_seccion_id,
            ],
        )
        return Recurso.objects.filter(id_recurso__in=recursos_ids)


class DificultadDetail(generics.ListAPIView):
    queryset = DificultadCurso.objects.all()
    serializer_class = DificultadSerializer


class CursoCreateView(generics.CreateAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoCreateSerializer


class CursoDetail(generics.ListAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer


class CursoDetailView(generics.RetrieveAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoDetalleSerializer


class InscripcionCursoCreateView(generics.CreateAPIView):
    queryset = InscripcionCurso.objects.all()
    serializer_class = InscripcionCursoSerializer

class ProgresoPorEstudianteView(APIView):
    def get(self, request, id_estudiante):
        try:
            estudiante = models.Estudiante.objects.get(id_estudiante=id_estudiante)
        except models.Estudiante.DoesNotExist:
            return Response({"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        inscripciones = InscripcionCurso.objects.filter(estudiante_inscripcion=estudiante).select_related('curso_inscripcion')
        serializer = ProgresoInscripcionSerializer(inscripciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
class QuizList(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class QuizDetail(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class PreguntaList(generics.ListAPIView):
    serializer_class = PreguntaQuizSerializer

    def get_queryset(self):
        quiz_id = self.request.query_params.get("quiz")
        if quiz_id:
            return PreguntaQuiz.objects.filter(quiz_id=quiz_id)
        return PreguntaQuiz.objects.all()


class FeedbackCreateView(generics.CreateAPIView):
    queryset = FeedbackSeccion.objects.all()
    serializer_class = FeedbackSerializer


class FeedbackListSeccionView(generics.ListAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        seccion_id = self.kwargs["seccion_id"]
        return FeedbackSeccion.objects.filter(
            from_seccion__id_seccion=seccion_id
        ).order_by("-fecha_feedback")


class CodeExecutorAPIView(APIView):
    def post(self, request, *args, **kwargs):
        input_serializer = CodeExecutionInputSerializer(data=request.data)

        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = input_serializer.validated_data["code"]
        language = input_serializer.validated_data["language"]

        if language != "python":
            return Response(
                {
                    "error": "Lenguaje no soportado.",
                    "details": "Actualmente solo se soporta 'python'.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        output = ""
        execution_status = "success"
        timeout_seconds = 5  # 5 sec para evitar bucles infinitos
        temp_file_path = None

        try:
            # 1. Crear un archivo temporal para el código Python
            with tempfile.NamedTemporaryFile(
                mode="w", delete=False, suffix=".py", encoding="utf-8"
            ) as temp_file:
                temp_file.write(code)
                temp_file_path = temp_file.name

            # 2. Ejecutar el código Python usando subprocess
            result = subprocess.run(
                ["python", temp_file_path],
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                check=False,  # En caso de código de error (ej. SyntaxError)
            )

            # 3. Procesar la salida
            if result.stdout:
                output += result.stdout
            if result.stderr:
                output += "\n" + result.stderr

            # 4. Determinar el estado de la ejecución
            if result.returncode != 0:
                execution_status = "error"
            elif "Timeout" in output:
                execution_status = "timeout"

        except subprocess.TimeoutExpired:
            output = f"Error: La ejecución del código excedió el límite de tiempo ({timeout_seconds} segundos)."
            execution_status = "timeout"
        except FileNotFoundError:
            output = "Error: El intérprete de Python no se encontró."
            execution_status = "error"
        except Exception as e:
            output = f"Error inesperado al ejecutar el código: {str(e)}"
            execution_status = "error"
        finally:
            # 5. Limpiar el archivo temporal
            if "temp_file_path" in locals() and os.path.exists(temp_file_path):
                os.remove(temp_file_path)

        # Limpiado del nombre del archivo en el output
        if temp_file_path:
            # Escapar la ruta para que sea segura en la regex (especialmente en Windows con '\')
            escaped_temp_path = re.escape(temp_file_path)
            output = re.sub(
                rf"File \"{escaped_temp_path}\", line (\d+), in <module>",
                r"File \"<string>\", line \1, in <module>",
                output,
            )
            output = re.sub(
                rf"File \"{escaped_temp_path}\"", r"File \"<string>\"", output
            )

        # Eliminar cualquier otra ruta temporal que pueda aparecer, aunque el anterior es el más común
        output = re.sub(
            r"File \".*?tmp[a-zA-Z0-9]+\.py\", line (\d+), in <module>",
            r"File \"<string>\", line \1, in <module>",
            output,
        )
        output = re.sub(
            r"File \".*?tmp[a-zA-Z0-9]+\.py\"", r"File \"<string>\"", output
        )

        # 6. Preparar la respuesta usando el Output Serializer
        output_data = {"output": output.strip(), "status": execution_status}
        output_serializer = CodeExecutionOutputSerializer(data=output_data)
        output_serializer.is_valid(raise_exception=True)

        return Response(output_serializer.data, status=status.HTTP_200_OK)


class ComentarioCreateView(generics.CreateAPIView):
    serializer_class = ComentarioCreateSerializer


class ComentarioDetailView(generics.ListAPIView):
    serializer_class = ComentarioDetailSerializer
    queryset = Comentario.objects.all().order_by("-fecha_creacion_comentario")

    def get_queryset(self):
        curso_id = self.kwargs["curso_id"]
        return Comentario.objects.filter(curso_id=curso_id)
    
class CursoDeleteView(generics.DestroyAPIView):
    queryset = Curso.objects.all()
    lookup_field = "id_curso" 
