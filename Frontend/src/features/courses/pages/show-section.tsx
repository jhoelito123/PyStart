import { useParams } from 'react-router';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import CardShowSection from '../components/card-show-section';

type Recurso = {
  nombre_recurso: string;
  url_recurso: string;
  texto_recurso: string;
  tipo_recurso: number;
};

type Seccion = {
  id_seccion: number;
  nombre_seccion: string;
  descripcion_seccion: string;
  duracion_seccion: string;
  video_seccion: Recurso;
  contenido_seccion: Recurso;
  instruccion_ejecutor_seccion: Recurso;
};

export default function ShowSectionPage() {
  const { id } = useParams();
  const {
    data: seccion,
    loading,
    error,
  } = useFetchData<Seccion>(`${API_URL}/education/secciones/${id}`);

  if (loading) return <p className="p-4">Cargando sección...</p>;
  if (error || !seccion)
    return <p className="p-4 text-red-500">Sección no encontrada</p>;

  return (
    <div className="min-h-screen px-10">
      <CardShowSection
        title={seccion.nombre_seccion}
        video={seccion.video_seccion.url_recurso}
        text={
          seccion.contenido_seccion.texto_recurso || seccion.descripcion_seccion
        }
        code={seccion.instruccion_ejecutor_seccion.texto_recurso || ''}
      />
    </div>
  );
}
