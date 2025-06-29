from django.urls import path
from . import views

urlpatterns = [
    path("admins/", views.AdminCreateView.as_view(), name="create-admin"),
    path("docentes/register", views.DocenteCreateView.as_view(), name="create-docente"),
    path(
        "docentes/<int:id_docente>/",
        views.DocenteDetailView.as_view(),
        name="get-docente",
    ),
    path(
        "estudiante/register",
        views.EstudianteRegistroView.as_view(),
        name="create-estudiante",
    ),
    path(
        "estudiante/<int:id_estudiante>/",
        views.EstudianteDetailView.as_view(),
        name="get-estudiante",
    ),
    path("login/", views.LoginView.as_view(), name="login"),
    path(
        "estudiante/curso/<int:curso_id>/",
        views.EstudiantesPorCursoView.as_view(),
        name="estudiantes-por-curso",
    ),
]
