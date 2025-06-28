import { useParams, useNavigate } from 'react-router';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import CardShowSection from '../components/card-show-section';
import { Button } from '../../../components/ui/button';
import { useEffect, useState } from 'react';
import IconBefore from '../../../components/icons/before';
import IconNext from '../../../components/icons/next';
import { FeedbackList } from '../components/feedback-list';

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
  seccion_del_curso: number;
  video_seccion: Recurso;
  contenido_seccion: Recurso;
  instruccion_ejecutor_seccion: Recurso;
};

export default function ShowSectionPage() {
  const { id_section } = useParams();
  const navigate = useNavigate();
  const [seccionesCurso, setSeccionesCurso] = useState<Seccion[]>([]);

  const {
    data: seccion,
    loading,
    error,
  } = useFetchData<Seccion>(`${API_URL}/education/secciones/${id_section}`);

  // Cuando cargue la sección actual, buscar TODAS las secciones del curso
  useEffect(() => {
    if (seccion?.seccion_del_curso) {
      fetch(`${API_URL}/education/cursos/${seccion.seccion_del_curso}`)
        .then((res) => res.json())
        .then((curso) => {
          setSeccionesCurso(curso.secciones || []);
        });
    }
  }, [seccion]);

  if (loading) return <p className="p-4">Cargando sección...</p>;
  if (error || !seccion)
    return <p className="p-4 text-red-500">Sección no encontrada</p>;

  const currentIndex = seccionesCurso.findIndex(
    (s) => s.id_seccion === seccion.id_seccion,
  );

  const seccionAnterior = seccionesCurso[currentIndex - 1];
  const seccionSiguiente = seccionesCurso[currentIndex + 1];

  return (
    <div className="min-h-screen px-10">
      <CardShowSection
        title={seccion.nombre_seccion}
        codeInstruction={seccion.instruccion_ejecutor_seccion.nombre_recurso}
        video={seccion.video_seccion.url_recurso}
        text={
          seccion.contenido_seccion.texto_recurso || seccion.descripcion_seccion
        }
        code={seccion.instruccion_ejecutor_seccion.texto_recurso || ''}
      />
      <FeedbackList id_seccion={seccion.id_seccion} />
      <div className="flex justify-between mt-10">
        <Button
          label="Anterior"
          icon1={IconBefore}
          variantColor="variant2"
          disabled={!seccionAnterior}
          onClick={() =>
            seccionAnterior &&
            navigate(
              `/student/course/${seccion.seccion_del_curso}/section/${seccionAnterior.id_seccion}`,
            )
          }
        />
        <Button
          label="Siguiente"
          icon2={IconNext}
          variantColor="variant1"
          disabled={!seccionSiguiente}
          onClick={() =>
            seccionSiguiente &&
            navigate(
              `/student/course/${seccion.seccion_del_curso}/section/${seccionSiguiente.id_seccion}`,
            )
          }
        />
      </div>
    </div>
  );
}
