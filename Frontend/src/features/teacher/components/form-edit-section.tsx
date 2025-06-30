import { useForm } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components';
import { UploadVideo } from '../../../components/ui/upload-video';
import { TextArea } from '../../../components/ui/textarea';
import { useEffect, useState } from 'react';
import { getData, putData } from '../../../services/api-service';
import { useCloudinaryUpload } from '../../../hooks';
import Swal from 'sweetalert2';
import Ejecutor from '../../courses/components/editor-code';
import { useParams } from 'react-router';

interface FormData {
  section: {
    title: string;
    description: string;
    explanation: string;
    codeExecutorInstruction: string;
    video: FileList | null;
  };
}

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

export default function FormEditSection() {
  const { id } = useParams(); // id de la sección
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      section: {
        title: '',
        description: '',
        explanation: '',
        codeExecutorInstruction: '',
        video: null,
      },
    },
  });

  const { uploadFile } = useCloudinaryUpload();
  const [codigoEjecutor, setCodigoEjecutor] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Observar todos los campos para detectar cambios
  const watchedFields = watch();

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        reject('No se pudo obtener la duración del video');
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Cargar datos de la sección
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await getData(`/education/secciones/${id}/`);
        setSectionData(response);

        const initialData = {
          section: {
            title: response.nombre_seccion,
            description: response.descripcion_seccion,
            explanation: response.contenido_seccion?.texto_recurso || '',
            codeExecutorInstruction:
              response.instruccion_ejecutor_seccion?.nombre_recurso || '',
            video: null,
          },
        };

        setOriginalData(initialData);
        setCodigoEjecutor(
          response.instruccion_ejecutor_seccion?.texto_recurso || '',
        );

        setValue('section.title', initialData.section.title);
        setValue('section.description', initialData.section.description);
        setValue('section.explanation', initialData.section.explanation);
        setValue(
          'section.codeExecutorInstruction',
          initialData.section.codeExecutorInstruction,
        );
      } catch (error) {
        console.error('Error al obtener la sección:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información de la sección',
        });
      }
    };

    if (id) {
      fetchSection();
    }
  }, [id, setValue]);

  // Detectar cambios comparando con los datos originales
  useEffect(() => {
    if (originalData && watchedFields) {
      const hasAnyChanges =
        watchedFields.section.title !== originalData.section.title ||
        watchedFields.section.description !==
          originalData.section.description ||
        watchedFields.section.explanation !==
          originalData.section.explanation ||
        watchedFields.section.codeExecutorInstruction !==
          originalData.section.codeExecutorInstruction ||
        watchedFields.section.video !== null ||
        codigoEjecutor !==
          (sectionData?.instruccion_ejecutor_seccion?.texto_recurso || '');

      setHasChanges(hasAnyChanges);
    }
  }, [watchedFields, originalData, codigoEjecutor, sectionData]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas actualizar esta sección?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#FF2162',
        cancelButtonColor: '#3257FF',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      });

      if (!result.isConfirmed) {
        return;
      }

      setIsSubmitting(true);

      let videoUrl = sectionData?.video_seccion?.url_recurso;
      let duracionFormato = sectionData?.duracion_seccion;

      // Solo subir nuevo video si se seleccionó uno
      if (data.section.video && data.section.video.length > 0) {
        const file = data.section.video[0];
        const duracionSegundos = await getVideoDuration(file);
        duracionFormato = new Date(duracionSegundos * 1000)
          .toISOString()
          .substr(11, 8);

        const videoData = await uploadFile(file);
        if (!videoData || !videoData.secure_url) {
          Swal.fire({
            icon: 'error',
            title: 'Error al subir el video',
            text: 'No se pudo obtener la URL del video. Intenta nuevamente.',
          });
          setIsSubmitting(false);
          return;
        }
        videoUrl = videoData.secure_url;
      }

      const payload = {
        nombre_seccion: data.section.title,
        descripcion_seccion: data.section.description,
        seccion_del_curso: sectionData?.seccion_del_curso || 0,
        duracion_seccion: duracionFormato,
        video_seccion: {
          nombre_recurso: 'Video de Sección',
          url_recurso: videoUrl,
          texto_recurso: '',
          tipo_recurso: 1,
        },
        contenido_seccion: {
          nombre_recurso: 'Explicación de la sección',
          url_recurso: null,
          texto_recurso: data.section.explanation,
          tipo_recurso: 2,
        },
        instruccion_ejecutor_seccion: {
          nombre_recurso: data.section.codeExecutorInstruction,
          url_recurso: null,
          texto_recurso: codigoEjecutor,
          tipo_recurso: 3,
        },
      };

      await putData(`/education/secciones/${id}/`, payload);

      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Sección actualizada exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });

      window.location.href = `/teacher/course/${sectionData?.seccion_del_curso}/sections`;
    } catch (error: any) {
      console.error('Error al actualizar la sección:', error);

      let errorMessage = 'Error al actualizar la sección';

      if (error.response) {
        errorMessage =
          error.response.data?.message || error.response.data || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sectionData) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-emerald-600 text-2xl animate-spin flex items-center justify-center border-t-emerald-600 rounded-full"></div>
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-600">Cargando sección...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />
      <form
        className="w-full h-full justify-center shadow-2xl rounded-2xl p-10 px-22 bg-white mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-slate-900 headline-lg sm:text-xl md:text-2xl font-semibold mb-6">
          Editar Sección de Curso
        </h1>
        <div className="flex flex-col space-x-9">
          <div className="grid grid-cols-1 lg:grid-cols-1 w-full lg:gap-9 mb-2">
            <InputText
              label="Título de la sección"
              name="section.title"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El título es obligatorio',
                pattern: {
                  value: /^[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 w-full">
            <TextArea
              label="Descripción"
              name="section.description"
              className="w-full"
              placeholder="Escribe una breve descripción de la sección del curso"
              register={register}
              validationRules={{
                required:
                  'La descripción de la sección del curso es obligatoria',
                minLength: {
                  value: 20,
                  message: 'La descripción debe tener al menos 20 caracteres',
                },
                maxLength: {
                  value: 500,
                  message: 'La descripción no puede exceder los 500 caracteres',
                },
                validate: (value: string) =>
                  value.trim().length > 0 ||
                  'La descripción no puede estar vacía',
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 mb-2">
            <div className="grid grid-cols-1 mt-5">
              <TextArea
                label="Explicación de la sección del curso"
                name="section.explanation"
                className="w-full"
                placeholder="Escribe la explicación de la sección del curso"
                register={register}
                validationRules={{
                  required:
                    'La explicación de la sección del curso es obligatoria',
                  minLength: {
                    value: 20,
                    message: 'La explicación debe tener al menos 20 caracteres',
                  },
                  maxLength: {
                    value: 500,
                    message:
                      'La explicación no puede exceder los 500 caracteres',
                  },
                  validate: (value: string) =>
                    value.trim().length > 0 ||
                    'La explicación no puede estar vacía',
                }}
                errors={errors}
              />
              <TextArea
                label="Instrucción del ejecutor de código"
                name="section.codeExecutorInstruction"
                className="w-full"
                placeholder="Escribe la instrucción del ejecutor de código"
                register={register}
                validationRules={{
                  required:
                    'La instrucción del ejecutor de código es obligatoria',
                  minLength: {
                    value: 10,
                    message: 'La instrucción debe tener al menos 10 caracteres',
                  },
                  maxLength: {
                    value: 1000,
                    message:
                      'La instrucción no puede exceder los 1000 caracteres',
                  },
                  validate: (value: string) =>
                    value.trim().length > 0 ||
                    'La instrucción no puede estar vacía',
                }}
                errors={errors}
              />
            </div>
            <div className="grid grid-cols-1 lg:gap-9 mb-6">
              <UploadVideo
                name="section.video"
                register={register}
                setValue={setValue}
                error={errors.section?.video}
                currentVideo={sectionData.video_seccion?.url_recurso}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mb-10 h-[560px]">
          <p className="text-slate-900 body-lg mb-4">
            Código del ejecutor de código de la sección del curso:
          </p>
          <div className="flex flex-col">
            <Ejecutor
              onCodeChange={setCodigoEjecutor}
              initialCode={codigoEjecutor}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:space-x-5">
          <Button
            label="Cancelar"
            variantColor="variant2"
            className="mt-5 md:mt-0"
            onClick={async () => {
              const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Los cambios no guardados se perderán',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF2162',
                cancelButtonColor: '#3257FF',
                confirmButtonText: 'Sí, cancelar',
                cancelButtonText: 'Continuar editando',
              });

              if (result.isConfirmed) {
                window.location.href = `/teacher/course/${sectionData.seccion_del_curso}/sections`;
              }
            }}
          />
          <Button
            type="submit"
            label="Actualizar"
            disabled={!hasChanges || isSubmitting}
            variantColor={isSubmitting ? 'variantDesactivate' : 'variant1'}
          />
        </div>
      </form>
    </div>
  );
}
