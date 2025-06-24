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

export default function FormCourse() {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors, isValid },
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadFile } = useCloudinaryUpload();

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
      setIsSubmitting(true);

      if (!data.image || data.image.length === 0) {
        alert('Por favor selecciona una imagen');
        setIsSubmitting(false);
        return;
      }
      const imageResult = await uploadFile(data.image[0]);

      if (!imageResult) {
        alert('Error al subir la imagen');
        setIsSubmitting(false);
        return;
      }
      const payload = {
        nombre_curso: data.name,
        descripcion_curso: data.desc,
        portada_curso: imageResult.secure_url,
        fecha_inicio_curso: data.dateini,
        fecha_cierre_curso: data.dateend,
        modulo_curso: parseInt(data.module),
        idioma_curso: parseInt(data.language),
        dificultad_curso: parseInt(data.level),
        profesor_curso: 1,
      };

      await axios.post(`${API_URL}/education/curso/create/`, payload);
      alert('Curso registrado exitosamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />
      <form
        className="w-full h-full justify-center shadow-2xl rounded-2xl p-10 px-22 bg-white mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-slate-900 headline-lg sm:text-xl md:text-2xl font-semibold mb-6">
          Registro de Curso
        </h1>
        <div className="flex space-x-9">
          <div className="w-9/12">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 mb-6">
              {' '}
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
              {' '}
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
          />
          <Button
            type="submit"
            label="Registrar"
            disabled={!isValid || isSubmitting}
            variantColor={isSubmitting ? 'variantDesactivate' : 'variant1'}
          />
        </div>
      </form>
    </div>
  );
}
