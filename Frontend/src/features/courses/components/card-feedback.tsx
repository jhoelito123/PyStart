import { format } from 'date-fns';

type Feedback = {
  id_feedback: number;
  from_seccion: number;
  nombre_seccion: string;
  contenido_feedback: string;
  fecha_feedback: string;
  autor_feedback: number;
  autor_nombre: string;
};

export const FeedbackCard = ({ feedback }: { feedback: Feedback }) => {
  const fechaFormateada = format(
    new Date(feedback.fecha_feedback),
    'dd/MM/yyyy HH:mm'
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-neutral-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-blue-600 font-semibold">
          {feedback.autor_nombre || `Usuario ${feedback.autor_feedback}`}
        </h4>
        <span className="text-sm text-gray-500">{fechaFormateada}</span>
      </div>
      <p className="text-slate-800 text-sm">{feedback.contenido_feedback}</p>
    </div>
  );
};
