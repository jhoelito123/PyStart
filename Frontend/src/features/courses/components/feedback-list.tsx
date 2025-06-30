import { useForm, SubmitHandler } from 'react-hook-form';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import { FeedbackCard } from './card-feedback';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { getCurrentUser } from '../../auth/services/auth.service';

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

type Feedback = {
  id_feedback: number;
  from_seccion: number;
  nombre_seccion: string;
  contenido_feedback: string;
  fecha_feedback: string;
  autor_feedback: number;
  autor_nombre: string;
};

type FeedbackForm = {
  contenido_feedback: string;
};

export const FeedbackList = ({ id_seccion }: { id_seccion: number }) => {
  const {
    data: feedbacks,
    loading,
    error,
    refetch,
  } = useFetchData<Feedback[]>(
    `${API_URL}/education/feedback/seccion/${id_seccion}/`
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackForm>({
    mode: 'onChange',
  });

  const contenido = watch('contenido_feedback') || '';
  const isEmpty = contenido.trim() === '';
  const [visibleCount, setVisibleCount] = useState(5);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const onSubmit: SubmitHandler<FeedbackForm> = async (data) => {
    try {
      const res = await fetch(`${API_URL}/education/feedback/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_seccion: id_seccion,
          contenido_feedback: data.contenido_feedback,
          autor_feedback: estudianteId,
        }),
      });

      if (res.ok) {
        reset();
        refetch?.();
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Feedback enviado correctamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: 'Error al enviar feedback',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error('Error de red:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
      });
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4 text-slate-900">Feedback</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-4 border border-neutral-200 mb-6"
      >
        <InputText
          label="Escribe tu feedback"
          name="contenido_feedback"
          register={register}
          errors={errors}
          validationRules={{
            maxLength: {
              value: 300,
              message: 'Máximo 300 caracteres',
            },
          }}
          isRequired={false}
        />

        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            label="Enviar Feedback"
            disabled={isEmpty || isSubmitting}
            variantColor={isSubmitting ? 'variantDesactivate' : 'variant1'}
          />
        </div>
      </form>

      {loading ? (
        <p className="mt-4">Cargando feedbacks...</p>
      ) : error || !feedbacks?.length ? (
        <p className="mt-4 text-slate-600">No hay feedbacks aún.</p>
      ) : (
        <>
          {feedbacks.slice(0, visibleCount).map((feedback) => (
            <FeedbackCard key={feedback.id_feedback} feedback={feedback} />
          ))}

          {visibleCount < feedbacks.length && (
            <div className="mt-4 flex justify-center">
              <Button label="Ver más" variantColor='variantText' onClick={handleShowMore} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
