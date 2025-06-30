import { useForm } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components';
import { Dropdown } from '../../../components/ui/dropdown';
import { UploadVideo } from '../../../components/ui/upload-video';
import { TextArea } from '../../../components/ui/textarea';
import { useEffect, useState } from 'react';
import { getData, postData } from '../../../services/api-service';
import { useCloudinaryUpload } from '../../../hooks';
import Swal from 'sweetalert2';
import Ejecutor from './editor-code';

interface FormData {
  section: {
    course: string;
    title: string;
    description: string;
    explanation: string;
    format: string;
    codeExecutorInstruction: string;
    video: FileList | null;
  };
}

interface Curso extends Record<string, string | number> {
  id_curso: number;
  nombre_curso: string;
}

export default function FormSectionCourse() {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      section: {
        course: '',
        title: '',
        description: '',
        explanation: '',
        format: '',
        codeExecutorInstruction: '',
        video: null,
      },
    },
  });

  const { uploadFile } = useCloudinaryUpload();
  const [codigoEjecutor, setCodigoEjecutor] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
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

  const onSubmit = async (data: FormData) => {
    try {
      if (!data.section.video || data.section.video.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Video requerido',
          text: 'Por favor selecciona un video antes de continuar.',
        });
        return;
      }

      const file = data.section.video[0];

      Swal.fire({
        title: 'Registrando sección...',
        text: 'Por favor espera mientras se sube el video y se guarda la información.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const duracionSegundos = await getVideoDuration(file);
      const duracionFormato = new Date(duracionSegundos * 1000)
        .toISOString()
        .substr(11, 8);

      const videoData = await uploadFile(file);

      if (!videoData || !videoData.secure_url) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al subir el video',
          text: 'No se pudo obtener la URL del video. Intenta nuevamente.',
        });
        return;
      }

      const payload = {
        nombre_seccion: data.section.title,
        descripcion_seccion: data.section.description,
        seccion_del_curso: parseInt(data.section.course),
        duracion_seccion: duracionFormato,
        video_seccion: {
          nombre_recurso: 'Video de Sección',
          url_recurso: videoData.secure_url,
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

      await postData('/education/secciones/', payload);

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: '¡Sección registrada!',
        text: 'La sección del curso fue registrada correctamente.',
      }).then(() => {
        window.location.reload();
      });

    } catch (err) {
      console.error('Error al registrar la sección:', err);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al registrar la sección. Intenta nuevamente.',
      });
    }
  };

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await getData('/education/curso/');
        setCursos(response);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />
      <form
        className="w-full h-full justify-center shadow-2xl rounded-2xl p-10 px-22 bg-white mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-slate-900 headline-lg sm:text-xl md:text-2xl font-semibold mb-6">
          Registrar Sección de Curso
        </h1>
        <div className="flex flex-col space-x-9">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full lg:gap-9 mb-2">
            <Dropdown
              name="section.course"
              label="Curso"
              options={cursos}
              displayKey="nombre_curso"
              valueKey="id_curso"
              placeholder="Selecciona un curso"
              register={register}
            />
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
                trigger={trigger}
                error={errors.section?.video}/>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mb-10 h-[560px]">
          <p className="text-slate-900 body-lg mb-4">
            Código del ejecutor de código de la sección del curso:
          </p>
          <div className="flex flex-col">
            <Ejecutor onCodeChange={setCodigoEjecutor} />
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:space-x-5">
          <Button
            label="Cancelar"
            variantColor="variant2"
            className="mt-5 md:mt-0"
          />
          <Button
            type="submit"
            label="Registrar"
            disabled={!isValid || Object.keys(errors).length > 0}
            variantColor={
              !isValid || Object.keys(errors).length > 0
                ? 'variantDesactivate'
                : 'variant1'
            }
          />
        </div>
      </form>
    </div>
  );
}
