from django.shortcuts import render
from rest_framework.exceptions import NotFound
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Admin, Docente, Estudiante, Usuario
from education.models import InscripcionCurso
from django.utils import timezone
from .serializers import (
    LoginSerializer,
    AdminCreateSerializer,
    DocenteCreateSerializer,
    DocenteDetailSerializer,
    EstudianteCreateSerializer,
    EstudianteDetailSerializer,
    EstudianteDetailByCoursesSerializer,
)


class AdminCreateView(generics.CreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminCreateSerializer
    permission_classes = [AllowAny]


class DocenteCreateView(generics.CreateAPIView):
    queryset = Docente.objects.all()
    serializer_class = DocenteCreateSerializer
    permission_classes = [AllowAny]  # Crear sin auth


class DocenteDetailView(generics.RetrieveAPIView):
    queryset = Docente.objects.all()
    serializer_class = DocenteDetailSerializer
    lookup_field = "id_docente"


class EstudianteRegistroView(generics.CreateAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteCreateSerializer
    lookup_field = "user_id"


class EstudianteDetailView(generics.RetrieveAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteDetailSerializer
    lookup_field = "id_estudiante"


class LoginView(APIView):
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        profile_data = serializer.validated_data.get("profile_data", {})
        user_type = serializer.validated_data["user_type"]
        user_id_global = serializer.validated_data["user_id_global"]

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        return Response(
            {
                "message": "Sesión correcta",
                "user_id": user_id_global,
                "username": user.username_user,
                "email": user.email_user,
                "tipo_de_usuario_loggeado": user_type,
                "profile_data": profile_data,
            },
            status=status.HTTP_200_OK,
        )


class EstudiantesPorCursoView(generics.ListAPIView):
    serializer_class = EstudianteDetailByCoursesSerializer

    def get_queryset(self):
        curso_id = self.kwargs.get("curso_id")
        resultado = []

        inscripciones = InscripcionCurso.objects.filter(curso_inscripcion_id=curso_id)
        if not inscripciones.exists():
            raise NotFound("No hay estudiantes inscritos en este curso.")

        for insc in inscripciones:
            estudiante = insc.estudiante_inscripcion
            resultado.append(estudiante)
        return resultado
