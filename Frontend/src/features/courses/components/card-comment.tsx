import { format } from 'date-fns';
import { StarRating } from './star-rating';

type Comment = {
  id_comentario: number;
  contenido_comentario: string;
  puntuacion_curso: string;
  fecha_creacion_comentario: string;
  autor_comentario: number;
};

export const CommentCard = ({ comment }: { comment: Comment }) => {
  const fechaFormateada = format(
    new Date(comment.fecha_creacion_comentario),
    'dd/MM/yyyy HH:mm',
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-neutral-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-blue-600 font-semibold">
          {comment.autor_comentario}
        </h4>
        <span className="text-sm text-gray-500">{fechaFormateada}</span>
      </div>
      <p className="text-slate-800 text-sm mb-2">
        {comment.contenido_comentario}
      </p>
      <div className="flex items-center space-x-1">
        <StarRating rating={comment.puntuacion_curso} size={16} />
        <span className="subtitle-md text-slate-900 ml-1">
          {comment.puntuacion_curso}
        </span>
      </div>
    </div>
  );
};
