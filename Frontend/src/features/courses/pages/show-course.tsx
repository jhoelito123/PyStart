import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import { CardShowCourse } from '../components/card-show-course';
import { useParams } from 'react-router';

type Curso = {
  id_curso: number;
  nombre_curso: string;
  duracion_curso: string;
  descripcion_curso: string;
  portada_curso: string;
  fecha_inicio_curso: string;
  fecha_cierre_curso: string;
  profesor_curso: number;
  modulo: number;
  idioma: number;
  dificultad: string;
  profesor: string;
  secciones: {
    id_seccion: number;
    nombre_seccion: string;
    descripcion_seccion: string;
  }[];
};

export default function ShowCoursePage() {
  const { id } = useParams();
  const {
    data: curso,
    loading,
    error,
  } = useFetchData<Curso>(`${API_URL}/education/cursos/${id}`);

  if (loading) return <p className="p-4">Cargando curso...</p>;
  if (error || !curso)
    return <p className="p-4 text-red-500">Curso no encontrado</p>;

  return (
    <div className="p-10 min-h-screen">
      <CardShowCourse
        title={curso.nombre_curso}
        university="Universidad Andina"
        language={curso.idioma}
        level={curso.dificultad}
        imageUrl={curso.portada_curso}
        description={curso.descripcion_curso}
        duration={convertirDuracionAHoras(curso.duracion_curso).toFixed(1)}
        practices={2}
        quizzes={3}
        tabs={{
          general: curso.descripcion_curso,
          syllabus: curso.secciones,
          requirements: 'Requiere conocimientos básicos de computación',
        }}
      />
    </div>
  );
}

function convertirDuracionAHoras(duracion: string): number {
  const [horas, minutos, segundos] = duracion.split(':').map(Number);
  return horas + minutos / 60 + segundos / 3600;
}
