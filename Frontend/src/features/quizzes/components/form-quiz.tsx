import { useForm, useFieldArray } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components';
import { Dropdown } from '../../../components/ui/dropdown';
import FormQuestion from './form-question';

interface Option {
  value: string;
}

interface Question {
  question: string;
  options: Option[];
  correctAnswer: number;
}

interface FormData {
  course: string;
  title: string;
  score: number;
  questions: Question[];
}

export default function FormQuiz() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      course: '',
      title: '',
      score: 0,
      questions: [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

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

  const onSubmit = (data: FormData) => {
    console.log('Quiz completo:', data);
  };

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />
      <form
        className="w-full h-full justify-center shadow-2xl rounded-2xl p-10 px-22 bg-white mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-slate-900 headline-lg sm:text-xl md:text-2xl mb-6">
          Registro de Quiz en un Curso
        </h1>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <Dropdown
            name="course"
            label="Curso"
            options={cursos}
            displayKey="curso"
            valueKey="id"
            placeholder="Selecciona un curso"
            register={register}
          />
          <InputText
            label="Título del quiz"
            name="title"
            register={register}
            className="w-full"
            validationRules={{
              required: 'El título es obligatorio',
              pattern: {
                value: /^[A-Za-zÑñÁÉÍÓÚáéíóú0-9 ]+$/,
                message: 'Solo letras, números y espacios permitidos',
              },
            }}
            errors={errors}
          />
          <InputText
            label="Puntaje total"
            name="score"
            type="number"
            register={register}
            className="w-full"
            validationRules={{
              required: 'El puntaje es obligatorio',
              min: { value: 0, message: 'Debe ser mayor o igual a 0' },
              max: { value: 100, message: 'Máximo 100' },
            }}
            errors={errors}
          />
        </div>

        <div className="flex flex-col mb-6">
          <h2 className="subtitle-md mb-4 text-slate-900">Preguntas</h2>
          {questionFields.map((question, qIndex) => (
            <FormQuestion
              key={question.id}
              question={question}
              qIndex={qIndex}
              control={control}
              register={register}
              errors={errors}
              remove={removeQuestion}
            />
          ))}

          <Button
            type="button"
            label="Añadir nueva pregunta"
            onClick={() =>
              appendQuestion({
                question: '',
                correctAnswer: 0,
                options: [{ value: '' }],
              })
            }
          />
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between md:space-x-4 mt-8">
          <Button label="Cancelar" variantColor="variant2" />
          <Button
            type="submit"
            label="Registrar Quiz"
            disabled={!isValid}
            variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
          />
        </div>
      </form>
    </div>
  );
}
