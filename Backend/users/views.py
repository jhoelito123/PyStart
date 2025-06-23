from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Admin, Docente, Estudiante, Usuario
from django.utils import timezone
from .serializers import (
    LoginSerializer,
    AdminCreateSerializer,
    DocenteCreateSerializer,
    DocenteDetailSerializer,
    EstudianteCreateSerializer,
    EstudianteDetailSerializer,
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
    permission_classes = ()  # Permite que cualquiera acceda a esta vista

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        return Response(
            {
                "message": "Sesión correcta",
                "tipo_de_usuario_loggeado": user.tipo_de_user.tipo_usuario,
                "user_id": user.user_id,
                "username": user.username_user,
                "email": user.email_user,
            },
            status=status.HTTP_200_OK,
        )
