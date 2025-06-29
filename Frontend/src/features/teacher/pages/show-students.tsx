import { useParams } from 'react-router';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import CardStudent from '../components/card-student';

type Student = {
  id_estudiante: number;
  nombre_estudiante: string;
  apellidos_estudiante: string;
  ci_estudiante: string;
};

export default function StudentsByCoursePage() {
  const { id } = useParams(); // id del curso
  const {
    data: students,
    loading,
    error,
  } = useFetchData<Student[]>(`${API_URL}/users/estudiante/curso/${id}/`);

  if (loading)
    return <p className="p-4 text-gray-600">Cargando estudiantes...</p>;
  if (error || !students)
    return <p className="p-4 text-red-500">No se pudo cargar la lista.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Estudiantes inscritos
      </h1>

      {students.length === 0 ? (
        <p className="text-neutral-500">Este curso no tiene estudiantes aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <CardStudent key={student.id_estudiante} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
