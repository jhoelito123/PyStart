from django.urls import path
from . import views

urlpatterns = [
    path('admins/', views.AdminCreateView.as_view(), name='create-admin'),
    path('docentes/register', views.DocenteCreateView.as_view(), name='create-docente'),
    path('docentes/<int:id_docente>/', views.DocenteDetailView.as_view(), name='get-docente'),
    path('estudiante/register',views.EstudianteRegistroView.as_view(), name='create-estudiante'),
    path('estudiante/<int:id_estudiante>/', views.EstudianteDetailView.as_view(), name="get-estudiante"),
]