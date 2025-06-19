from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeccionViewSet
from . import views

router = DefaultRouter()
router.register(r'secciones', SeccionViewSet, basename='seccion')
urlpatterns = [
    # For Institucion
    path("departamentos/", views.DepartamentoList.as_view(), name="departamento-list"),
    path(
        "departamentos/<int:pk>/",
        views.DepartamentoDetail.as_view(),
        name="departamento-detail",
    ),
    path("provincias/", views.ProvinciaList.as_view(), name="provincia-list"),
    path(
        "provincias/<int:pk>/", views.ProvinciaDetail.as_view(), name="provincia-detail"
    ),
    path(
        "departamentos/<int:departamento_id>/provincias/",
        views.ProvinciasPorDepartamento.as_view(),
        name="provincias-por-departamento",
    ),
    
    path(
        "nivel-educativo/",
        views.NivelAcademicoList.as_view(),
        name="nivel-academico-list",
    ),
    path(
        "instituciones/create",
        views.InstitucionCreateView.as_view(),
        name="institucion-list-create",
    ),
    # For Courses
    path("modulos/", views.ModuloDetail.as_view(), name="modulos-list"),
    path("idiomas/", views.IdiomaDetail.as_view(), name="languages-list"),
    path("dificultad/", views.DificultadDetail.as_view(), name="dificults-list"),
    path("curso/", views.CursoDetail.as_view(), name="courses-list"),
    path("curso/create/", views.CursoCreateView.as_view(), name="course-create"),
    path("cursos/<int:pk>/", views.CursoDetailView.as_view(), name="curso-detail"),
    # For Sections
    path("execute-code/", views.CodeExecutorAPIView.as_view(), name="execute-code"),
    path('tipos-recurso/', 
        views.TipoRecursoList.as_view(), 
        name='tipos-recurso-list'),
    path('', include(router.urls)),
    path('recursos/seccion/<int:seccion_id>/', 
        views.RecursosBySeccion.as_view(), 
        name='recursos-by-seccion'),
    # For Quizzes
    path("quizzes/", views.QuizList.as_view(), name="quiz-list"),
    path("quizzes/<int:pk>/", views.QuizDetail.as_view(), name="quiz-detail"),
    path("preguntas/", views.PreguntaList.as_view(), name="pregunta-list"),
]
