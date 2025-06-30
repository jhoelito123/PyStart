import { useNavigate } from 'react-router';
import { getCurrentUser } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { API_URL } from '../../../config/api-config';

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
type CourseSectionsListProps = {
  course: number;
  sections: {
    id_seccion: number;
    nombre_seccion: string;
    descripcion_seccion: string;
  }[];
  disabled?: boolean;
};

export const CourseSectionsList = ({
  course,
  sections,
  disabled = false,
}: CourseSectionsListProps) => {
  const navigate = useNavigate();

 const completarSeccion = async (seccionId: number) => {
  if (!estudianteId) {
    Swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'No estás logueado como estudiante',
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/education/progreso-secciones/completar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estudiante_id: estudianteId,
        seccion_id: seccionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Verificamos si el error es el de "ya existe"
      const uniqueSetError = errorData?.non_field_errors?.find((msg: string) =>
        msg.includes('must make a unique set')
      );

      if (uniqueSetError) {
        // Lo ignoramos: ya estaba registrada, no pasa nada
        console.warn('Sección ya estaba registrada como completada');
        return;
      }

      // Si no era ese error, lo mostramos con Swal
      const errorMsg =
        typeof errorData === 'string'
          ? errorData
          : Object.values(errorData).flat().join('\n');

      Swal.fire({
        icon: 'error',
        title: 'Error al completar sección',
        text: errorMsg || 'Ocurrió un error desconocido',
      });

      return;
    }

    console.log('Sección completada correctamente');

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor. Intenta de nuevo.',
    });
    console.error(error);
  }
};

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div>
          <h4 className="font-bold text-slate-800">Sección {index + 1}</h4>
          <div
            className={`
              bg-white rounded-lg shadow p-4 border border-neutral-200
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-neutral-100'}
            `}
            onClick={async () => {
              if (!disabled) {
                await completarSeccion(section.id_seccion);
                navigate(`/student/course/${course}/section/${section.id_seccion}`);
              }
            }}
            title={disabled ? 'Debes estar inscrito para acceder' : ''}
          >
            <h4 className="font-bold text-slate-800">
              {section.nombre_seccion}
            </h4>
            <p className="text-slate-700 text-sm mt-1 whitespace-pre-line">
              {section.descripcion_seccion}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
