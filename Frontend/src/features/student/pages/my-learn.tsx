import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import { ProgressCard } from '../components/card-progress';
import { getCurrentUser } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';
const user = getCurrentUser();

const estudianteId = user?.profile_data?.id_estudiante;

if (!estudianteId) {
  Swal.fire({
    icon: 'warning',
    title: 'Acceso denegado',
    text: 'No estás logueado como estudiante',
    confirmButtonText: 'Aceptar'
  });
} else {
  console.log('ID del estudiante:', estudianteId);
}
type CursoProgreso = {
  id_inscripcion: number;
  nombre_curso: string;
  porcentaje_progreso: number;
  completado: boolean;
  fecha_inscripcion: string;
};

export default function MyLearnPage() {
  const {
    data: cursos,
    loading,
    error,
  } = useFetchData<CursoProgreso[]>(
    `${API_URL}/education/progreso-estudiante/${estudianteId}/`, // Obtener esto del usuario autenticado
  );

  if (loading) return <p className="p-4">Cargando progreso...</p>;
  if (error || !cursos)
    return <p className="p-4 text-red-500">Error al cargar los datos.</p>;

  return (
    <div className="min-h-screen px-10 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Mi Aprendizaje</h1>
      {cursos.map((curso) => (
        <ProgressCard key={curso.id_inscripcion} {...curso} />
      ))}
    </div>
  );
}
