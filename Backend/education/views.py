from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import subprocess
import tempfile
import os
import re
from datetime import timedelta # Necesario si usas DurationField en modelos
from django.db.models import Sum
from .models import Departamento, Provincia, NivelEducativo, Institucion, Modulo, Idioma, DificultadCurso, Curso
from .serializers import CodeExecutionInputSerializer, CodeExecutionOutputSerializer, DepartamentoSerializer, ProvinciaSerializer, NivelEducativoSerializer, InstitucionSerializer, ModuloSerializer, IdiomaSerializer, DificultadSerializer, CursoCreateSerializer, CursoSerializer

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
        departamento_id = self.kwargs['departamento_id']
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

class DificultadDetail(generics.ListAPIView):
    queryset = DificultadCurso.objects.all()
    serializer_class = DificultadSerializer

class CursoCreateView(generics.CreateAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoCreateSerializer

class CursoDetail(generics.ListAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    
class CodeExecutorAPIView(APIView):
    def post(self, request, *args, **kwargs):
        input_serializer = CodeExecutionInputSerializer(data=request.data)

        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = input_serializer.validated_data['code']
        language = input_serializer.validated_data['language']

        if language != 'python':
            return Response(
                {"error": "Lenguaje no soportado.", "details": "Actualmente solo se soporta 'python'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        output = ""
        execution_status = "success"
        timeout_seconds = 5  # 5 sec para evitar bucles infinitos
        temp_file_path = None

        try:
            # 1. Crear un archivo temporal para el código Python
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.py', encoding='utf-8') as temp_file:
                temp_file.write(code)
                temp_file_path = temp_file.name

            # 2. Ejecutar el código Python usando subprocess
            result = subprocess.run(
                ['python', temp_file_path],
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                check=False # En caso de código de error (ej. SyntaxError)
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
            if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                
        #Limpiado del nombre del archivo en el output
        if temp_file_path:
             # Escapar la ruta para que sea segura en la regex (especialmente en Windows con '\')
            escaped_temp_path = re.escape(temp_file_path)
            output = re.sub(rf"File \"{escaped_temp_path}\", line (\d+), in <module>", r"File \"<string>\", line \1, in <module>", output)
            output = re.sub(rf"File \"{escaped_temp_path}\"", r"File \"<string>\"", output)
        
        # Eliminar cualquier otra ruta temporal que pueda aparecer, aunque el anterior es el más común
        output = re.sub(r"File \".*?tmp[a-zA-Z0-9]+\.py\", line (\d+), in <module>", r"File \"<string>\", line \1, in <module>", output)
        output = re.sub(r"File \".*?tmp[a-zA-Z0-9]+\.py\"", r"File \"<string>\"", output)

        # 6. Preparar la respuesta usando el Output Serializer
        output_data = {
            "output": output.strip(),
            "status": execution_status
        }
        output_serializer = CodeExecutionOutputSerializer(data=output_data)
        output_serializer.is_valid(raise_exception=True)

        return Response(output_serializer.data, status=status.HTTP_200_OK)