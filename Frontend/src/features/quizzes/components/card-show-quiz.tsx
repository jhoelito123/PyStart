import { useForm } from 'react-hook-form';
import { Button } from '../../../components';
import { CardShowQuestion } from './card-show-question';

const mockQuiz = {
  title: 'Quiz de Introducción a Python',
  course: 'Python para Principiantes',
  score: 20,
  questions: [
    {
      question: '¿Qué tipo de lenguaje es Python?',
      options: [
        { value: 'Compilado' },
        { value: 'Interpretado' },
        { value: 'Ambos' },
        { value: 'Ninguno' },
      ],
      correctAnswer: 1,
    },
    {
      question: '¿Qué función se usa para imprimir en pantalla?',
      options: [
        { value: 'cout' },
        { value: 'echo' },
        { value: 'print()' },
        { value: 'display()' },
      ],
      correctAnswer: 2,
    },
  ],
};

interface FormAnswers {
  answers: number[];
}

export default function CardShowQuiz() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAnswers>({
    mode: 'onChange',
    defaultValues: {
      answers: [],
    },
  });

  const onSubmit = (data: FormAnswers) => {
    console.log('Respuestas del usuario:', data.answers);
    // Aquí podrías comparar con correctAnswer y calcular puntaje
  };

  return (
    <div className="w-full mx-auto p-6">
    <div className="rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
      <div className="h-3 bg-blue-500" /> {/* Borde superior azul */}

      <div className="bg-white p-6">
        <h2 className="headline-lg text-slate-900 mb-2">{mockQuiz.title}</h2>
        <p className="subtitle-sm text-slate-900 mb-1">Curso: {mockQuiz.course}</p>
        <p className="subtitle-sm text-slate-900">Puntaje total: {mockQuiz.score}</p>
      </div>
    </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {mockQuiz.questions.map((q, index) => (
          <CardShowQuestion
            key={index}
            question={q.question}
            options={q.options}
            index={index}
            register={register}
            errors={errors}
          />
        ))}

        <div className="flex justify-end">
          <Button type="submit" label="Enviar respuestas" />
        </div>
      </form>
    </div>
  );
}
