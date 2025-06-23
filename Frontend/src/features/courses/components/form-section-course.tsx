import { useForm } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components';
import { Dropdown } from '../../../components/ui/dropdown';
import { UploadVideo } from '../../../components/ui/upload-video';
import { TextArea } from '../../../components/ui/textarea';

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

export default function FormSectionCourse() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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

  const onSubmit = (data: any) => {
    console.log(data);
  };
  const cursos = [
    { id: 1, curso: 'Python para Principiantes' },
    { id: 2, curso: 'Fundamentos de Programación con Python' },
    { id: 3, curso: 'Python Intermedio: Funciones, Módulos y Paquetes' },
    { id: 4, curso: 'Manipulación de Datos con Python y Pandas' },
    { id: 5, curso: 'Automatización de Tareas con Python' },
    { id: 6, curso: 'Desarrollo Web con Flask y Python' },
    { id: 7, curso: 'Desarrollo Web con Django' },
    { id: 8, curso: 'Análisis de Datos con Python' },
    { id: 9, curso: 'Machine Learning con Python y Scikit-learn' },
    { id: 10, curso: 'Python para Ciencia de Datos' },
  ];

  const formatos = [
    { id: 1, formato: 'Texto' },
    { id: 2, formato: 'Html' },
  ];

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
              displayKey="curso"
              valueKey="id"
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
            <div className="grid grid-cols-1">
              <TextArea
                label="Explicación de la sección del curso (Puede ser texto o html"
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
                    value: 500,
                    message:
                      'La instrucción no puede exceder los 500 caracteres',
                  },
                  validate: (value: string) =>
                    value.trim().length > 0 ||
                    'La instrucción no puede estar vacía',
                }}
                errors={errors}
              />
              <Dropdown
                name="section.format"
                label="Formato de la explicación"
                options={formatos}
                displayKey="formato"
                valueKey="id"
                placeholder="Selecciona un formato"
                register={register}
              />
            </div>
            <div className="grid grid-cols-1 lg:gap-9 mb-6">
              <UploadVideo name="section.video" register={register} />
            </div>
            <div></div>
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
