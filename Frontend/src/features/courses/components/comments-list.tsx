// src/pages/show-course/components/comments-list.tsx

import { useFetchData } from '../../../hooks/use-fetch-data';
import { useParams } from 'react-router';
import { API_URL } from '../../../config/api-config';
import { CommentCard } from './card-comment';

type Comment = {
  id_comentario: number;
  contenido_comentario: string;
  puntuacion_curso: string;
  fecha_creacion_comentario: string;
  autor_comentario: number;
};

export const CommentsList = () => {
  const { id } = useParams();
  const {
    data: comments,
    loading,
    error,
  } = useFetchData<Comment[]>(`${API_URL}/education/comentarios/curso/${id}`);

  if (loading) return <p className="mt-4">Cargando comentarios...</p>;
  if (error || !comments?.length)
    return <p className="mt-4 text-slate-600">No hay comentarios aún.</p>;

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4 text-slate-900">Comentarios</h3>
      {comments.map((comment) => (
        <CommentCard key={comment.id_comentario} comment={comment} />
      ))}
    </div>
  );
};
