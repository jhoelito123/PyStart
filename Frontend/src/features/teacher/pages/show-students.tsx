import { useParams } from 'react-router';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import CardStudent from '../components/card-student';
import { Button } from '../../../components';
import { deleteData } from '../../../services/api-service';
import Swal from 'sweetalert2';

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

  const handleDeleteCourse = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este curso? Esta acción no se puede deshacer y eliminará todas las secciones asociadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF2162',
        cancelButtonColor: '#3257FF',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }

      await deleteData(`/education/curso/options/${id}/`);

      await Swal.fire({
        icon: 'success',
        title: '¡Curso eliminado!',
        text: 'El curso fue eliminado exitosamente',
        timer: 2000,
        showConfirmButton: false
      });

      // Regresar a la lista de cursos
      window.location.href = '/teacher/courses';

    } catch (error: any) {
      console.error('Error al eliminar el curso:', error);
      
      let errorMessage = 'Error al eliminar el curso';
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    }
  };

  if (loading)
    return <p className="p-4 text-gray-600">Cargando estudiantes...</p>;
  if (error || !students)
    return <p className="p-4 text-red-500">No se pudo cargar la lista.</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Estudiantes inscritos
        </h1>
        <div className="flex gap-3">
          <Button
            label="Ver Secciones"
            variantColor="variant1"
            onClick={() => window.location.href = `/teacher/course/${id}/sections`}
          />
          <Button
            label="Editar Curso"
            variantColor="variant1"
            onClick={() => window.location.href = `/teacher/course/${id}/edit`}
          />
          <Button
            label="Eliminar Curso"
            variantColor="variant2"
            onClick={handleDeleteCourse}
          />
        </div>
      </div>

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
