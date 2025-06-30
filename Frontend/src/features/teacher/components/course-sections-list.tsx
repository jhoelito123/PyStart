import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import { Button } from '../../../components';

type Section = {
  id_seccion: number;
  nombre_seccion: string;
  descripcion_seccion: string;
  seccion_del_curso: number;
  duracion_seccion: string;
  video_seccion: {
    id_recurso: number;
    nombre_recurso: string;
    url_recurso: string;
    texto_recurso: string;
    tipo_recurso: number;
  };
  contenido_seccion: {
    id_recurso: number;
    nombre_recurso: string;
    url_recurso: string | null;
    texto_recurso: string;
    tipo_recurso: number;
  };
  instruccion_ejecutor_seccion: {
    id_recurso: number;
    nombre_recurso: string;
    url_recurso: string | null;
    texto_recurso: string;
    tipo_recurso: number;
  };
};

type CourseSectionsListProps = {
  courseId: number;
};

export const CourseSectionsList = ({ courseId }: CourseSectionsListProps) => {
  const {
    data: sections,
    loading,
    error,
  } = useFetchData<Section[]>(`${API_URL}/education/secciones`);

  // Filtrar secciones del curso específico
  const courseSections = sections?.filter(
    (section) => section.seccion_del_curso === courseId
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-emerald-600 text-2xl animate-spin flex items-center justify-center border-t-emerald-600 rounded-full"></div>
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-600">Cargando secciones...</p>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">Error al cargar las secciones</p>;
  }

  if (!courseSections || courseSections.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Secciones del Curso
        </h1>
        <p className="text-neutral-500">Este curso no tiene secciones aún.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Secciones del Curso
      </h1>
      <div className="space-y-4">
        {courseSections.map((section, index) => (
          <div key={section.id_seccion}>
            <h4 className="font-bold text-slate-800 mb-2">
              Sección {index + 1}
            </h4>
            <div className="bg-white rounded-lg shadow p-4 border border-neutral-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">
                    {section.nombre_seccion}
                  </h4>
                  <p className="text-slate-700 text-sm mt-1 whitespace-pre-line">
                    {section.descripcion_seccion}
                  </p>
                </div>
                <Button
                  label="Editar"
                  variantColor="variant1"
                  onClick={() => window.location.href = `/teacher/section/${section.id_seccion}/edit`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 