from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Admin, Docente, Estudiante
from .serializers import AdminCreateSerializer, DocenteCreateSerializer, DocenteDetailSerializer, EstudianteCreateSerializer, EstudianteDetailSerializer

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
    lookup_field = 'id_docente'

class EstudianteRegistroView(generics.CreateAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteCreateSerializer
    lookup_field = 'user_id'

class EstudianteDetailView(generics.RetrieveAPIView):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteDetailSerializer
    lookup_field = 'id_estudiante'


