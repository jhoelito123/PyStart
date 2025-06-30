import { FieldError, useForm, useWatch } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components';
import { Dropdown } from '../../../components/ui/dropdown';
import { TextArea } from '../../../components/ui/textarea';
import { UploadCover } from '../../../components/ui/upload-cover';
import { useEffect, useState } from 'react';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { API_URL } from '../../../config/api-config';
import axios from 'axios';
import { useCloudinaryUpload } from '../../../hooks/use-cloudinary-upload';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';

interface FormData {
  module: string;
  level: string;
  language: string;
  name: string;
  desc: string;
  dateini: string;
  dateend: string;
  image: FileList | null;
}

type Curso = {
  id_curso: number;
  nombre_curso: string;
  calificacion_curso: number;
  duracion_curso: string;
  descripcion_curso: string;
  portada_curso: string;
  fecha_inicio_curso: string;
  fecha_cierre_curso: string;
  profesor_curso: number;
  modulo_curso: number;
  idioma_curso: number;
  dificultad_curso: number;
};

export default function FormEditCourse() {
  const { id } = useParams(); // id del curso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const { uploadFile } = useCloudinaryUpload();

  // Obtener datos del curso específico
  const {
    data: curso,
    loading: loadingCurso,
    error: errorCurso,
  } = useFetchData<Curso[]>(`${API_URL}/education/curso`);

  // Obtener el curso específico por ID
  const cursoActual = curso?.find((c) => c.id_curso === parseInt(id || '0'));

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      module: '',
      level: '',
      language: '',
      name: '',
      desc: '',
      dateini: '',
      dateend: '',
      image: null,
    },
  });

  // Observar todos los campos para detectar cambios
  const watchedFields = watch();

  // Cargar datos del curso cuando esté disponible
  useEffect(() => {
    if (cursoActual) {
      const initialData = {
        name: cursoActual.nombre_curso,
        desc: cursoActual.descripcion_curso,
        dateini: cursoActual.fecha_inicio_curso,
        dateend: cursoActual.fecha_cierre_curso,
        module: cursoActual.modulo_curso.toString(),
        language: cursoActual.idioma_curso.toString(),
        level: cursoActual.dificultad_curso.toString(),
        image: null,
      };

      setOriginalData(initialData);
      
      setValue('name', initialData.name);
      setValue('desc', initialData.desc);
      setValue('dateini', initialData.dateini);
      setValue('dateend', initialData.dateend);
      setValue('module', initialData.module);
      setValue('language', initialData.language);
      setValue('level', initialData.level);
    }
  }, [cursoActual, setValue]);

  // Detectar cambios comparando con los datos originales
  useEffect(() => {
    if (originalData && watchedFields) {
      const hasAnyChanges = 
        watchedFields.name !== originalData.name ||
        watchedFields.desc !== originalData.desc ||
        watchedFields.dateini !== originalData.dateini ||
        watchedFields.dateend !== originalData.dateend ||
        watchedFields.module !== originalData.module ||
        watchedFields.language !== originalData.language ||
        watchedFields.level !== originalData.level ||
        watchedFields.image !== null;

      setHasChanges(hasAnyChanges);
    }
  }, [watchedFields, originalData]);

  const { data: modules } = useFetchData<
    { id_modulo: number; nombre_modulo: string }[]
  >(`${API_URL}/education/modulos`);

  const { data: levels } = useFetchData<
    { id_dificultad: number; dificultad_curso: string }[]
  >(`${API_URL}/education/dificultad`);

  const { data: languages } = useFetchData<
    { id_idioma: number; idioma: string }[]
  >(`${API_URL}/education/idiomas`);

  const dateIni = useWatch({ control, name: 'dateini' });
  const dateEnd = useWatch({ control, name: 'dateend' });

  useEffect(() => {
    if (dateEnd) {
      trigger('dateend');
    }
  }, [dateIni, dateEnd, trigger]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas actualizar este curso?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#FF2162',
        cancelButtonColor: '#3257FF',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }

      setIsSubmitting(true);

      let imageUrl = cursoActual?.portada_curso;

      if (data.image && data.image.length > 0) {
        const imageResult = await uploadFile(data.image[0]);
        if (!imageResult) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al subir la imagen'
          });
          setIsSubmitting(false);
          return;
        }
        imageUrl = imageResult.secure_url;
      }

      const payload = {
        nombre_curso: data.name,
        descripcion_curso: data.desc,
        portada_curso: imageUrl,
        fecha_inicio_curso: data.dateini,
        fecha_cierre_curso: data.dateend,
        modulo_curso: parseInt(data.module),
        idioma_curso: parseInt(data.language),
        dificultad_curso: parseInt(data.level),
        profesor_curso: cursoActual?.profesor_curso || 1,
      };

      await axios.put(`${API_URL}/education/curso/options/${id}/`, payload);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Curso actualizado exitosamente',
        timer: 2000,
        showConfirmButton: false
      });
      
      window.location.href = '/teacher/courses';
    } catch (error) {
      console.error('Error al actualizar:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el curso'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCurso) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-emerald-600 text-2xl animate-spin flex items-center justify-center border-t-emerald-600 rounded-full"></div>
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-600">Cargando curso...</p>
      </div>
    );
  }

  if (errorCurso || !cursoActual) {
    return <p className="p-4 text-red-500">Error al cargar el curso</p>;
  }

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />
      <form
        className="w-full h-full justify-center shadow-2xl rounded-2xl p-10 px-22 bg-white mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-slate-900 headline-lg sm:text-xl md:text-2xl font-semibold mb-6">
          Editar Curso
        </h1>
        <div className="flex space-x-9">
          <div className="w-9/12">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 mb-6">
              <Dropdown
                name="module"
                label="Módulo"
                options={
                  modules?.map((item) => ({
                    id: item.id_modulo,
                    nombre: item.nombre_modulo,
                  })) || []
                }
                displayKey="nombre"
                valueKey="id"
                placeholder="Selecciona un módulo"
                register={register}
              />
              <InputText
                label="Nombre del curso"
                name="name"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'El nombre del curso es obligatorio',
                  pattern: {
                    value:
                      /^[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)*$/,
                    message:
                      'Solo se permiten letras, números y un espacio entre palabras',
                  },
                }}
                errors={errors}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 mb-6">
              <Dropdown
                name="level"
                label="Nivel"
                options={
                  levels?.map((item) => ({
                    id: item.id_dificultad,
                    nombre: item.dificultad_curso,
                  })) || []
                }
                displayKey="nombre"
                valueKey="id"
                placeholder="Selecciona un nivel"
                register={register}
              />
              <Dropdown
                name="language"
                label="Idioma"
                options={
                  languages?.map((item) => ({
                    id: item.id_idioma,
                    nombre: item.idioma,
                  })) || []
                }
                displayKey="nombre"
                valueKey="id"
                placeholder="Selecciona un idioma"
                register={register}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 mb-6">
              <InputText
                label="Fecha de inicio"
                name="dateini"
                type="date"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'La fecha de inicio es obligatoria',
                  validate: (value: string) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      selectedDate > today ||
                      'La fecha de inicio debe ser mayor a hoy'
                    );
                  },
                }}
                errors={errors}
              />
              <InputText
                label="Fecha de cierre"
                name="dateend"
                type="date"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'La fecha de cierre es obligatoria',
                  validate: (value: string) => {
                    if (!dateIni) return true;
                    const end = new Date(value);
                    const start = new Date(dateIni);
                    return (
                      end > start ||
                      'La fecha de cierre debe ser mayor a la fecha de inicio'
                    );
                  },
                }}
                errors={errors}
              />
            </div>

            <TextArea
              label="Descripción"
              name="desc"
              className="w-full"
              placeholder="Escribe una breve descripción del curso"
              register={register}
              validationRules={{
                required: 'La descripción del curso es obligatoria',
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
          <UploadCover
            name="image"
            register={register}
            error={errors.image as FieldError}
            currentImage={cursoActual.portada_curso}
            isOptional={true}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setValue('image', e.target.files, { shouldValidate: true });
              }
            }}
          />
        </div>

        <div className="flex flex-col-reverse md:flex-row md:justify-between md:space-x-5 mt-5">
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
                cancelButtonText: 'Continuar editando'
              });

              if (result.isConfirmed) {
                window.location.href = '/teacher/courses';
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