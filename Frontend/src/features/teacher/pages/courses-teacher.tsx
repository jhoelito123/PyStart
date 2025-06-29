import { useState } from 'react';
import SearchBar from '../../../components/ui/search';
import { API_URL } from '../../../config/api-config';
import { useFetchData } from '../../../hooks/use-fetch-data';
import CardCourseTeacher from '../components/card-course-teacher';

type Curso = {
  id_curso: number;
  nombre_curso: string;
  calificacion_curso: number;
  duracion_curso: string;
  descripcion_curso: string;
  portada_curso: string;
  fecha_inicio_curso: string;
  fecha_cierre_curso: string;
  profesor_curso: number;
  modulo_curso: number;
  idioma_curso: number;
  dificultad_curso: number;
};

export default function CoursesTeacherPage() {
  const [query, setQuery] = useState('');
  const {
    data: cursos,
    loading,
    error,
  } = useFetchData<Curso[]>(`${API_URL}/education/curso`);

  const cursosFiltrados = cursos?.filter((curso) =>
    curso.nombre_curso.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-emerald-600 text-2xl animate-spin flex items-center justify-center border-t-emerald-600 rounded-full"></div>
          </div>
        </div>

        <p className="mt-4 text-lg text-gray-600">Cargando cursos...</p>
      </div>
    );
  if (error) return <p className="p-4 text-red-500">Error al cargar cursos</p>;
  if (error) return <p className="p-4 text-red-500">Error al cargar cursos</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Cursos creados</h1>
        <SearchBar
          query={query}
          onChangeQuery={setQuery}
          placeholder="¿Qué curso buscas?"
        />
      </div>
      {cursosFiltrados?.length === 0 ? (
        <p className="text-neutral-500 mt-56 w-full flex items-center justify-center body-lg">
          No se encontraron cursos.
        </p>
      ) : (
        <div className="flex justify-center mt-10">
          <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
            {cursosFiltrados?.map((curso) => (
              <CardCourseTeacher
                key={curso.id_curso}
                level={mapDificultad(curso.dificultad_curso)}
                image={curso.portada_curso}
                title={curso.nombre_curso}
                rating={curso.calificacion_curso}
                votes={0}
                sections={1}
                practices={2}
                quizzez={3}
                link={`/teacher/course/${curso.id_curso}/students`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function mapDificultad(dificultad: number): string {
  switch (dificultad) {
    case 1:
      return 'Básico';
    case 2:
      return 'Intermedio';
    case 3:
      return 'Avanzado';
    default:
      return 'Desconocido';
  }
}
