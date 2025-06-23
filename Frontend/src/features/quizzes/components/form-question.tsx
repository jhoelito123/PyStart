import { useFieldArray } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { TextArea } from '../../../components/ui/textarea';
import { Button } from '../../../components';

interface QuestionFormProps {
  question: any;
  qIndex: number;
  control: any;
  register: any;
  errors: any;
  remove: (index: number) => void;
}

export default function FormQuestion({
  qIndex,
  control,
  register,
  errors,
  remove,
}: QuestionFormProps) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });

  return (
    <div className="border border-gray-200 p-10 rounded-2xl mb-6 bg-white shadow-lg">
      <TextArea
        label={`Pregunta ${qIndex + 1}`}
        name={`questions.${qIndex}.question`}
        placeholder="Escribe la pregunta"
        register={register}
        errors={errors}
      />

      <div className="mt-2">
        <h3 className="subtitle-md mb-3 text-slate-900">Opciones:</h3>

        {optionFields.map((option, optIndex) => (
          <div key={option.id} className="flex items-center gap-4 mb-3">
            <input
              type="radio"
              value={optIndex}
              {...register(`questions.${qIndex}.correctAnswer`, {
                required: 'Selecciona una respuesta correcta',
              })}
              className="accent-blue-600"
            />
            <InputText
              label={`Opción ${optIndex + 1}`}
              name={`questions.${qIndex}.options.${optIndex}.value`}
              className="w-full"
              register={register}
              errors={errors}
            />
            <Button
              type="button"
              label="Eliminar opción"
              variantColor="variant2"
              className="w-48"
              onClick={() => removeOption(optIndex)}
            />
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <Button
            type="button"
            label="Eliminar pregunta"
            variantColor="variant2"
            className="w-40"
            onClick={() => remove(qIndex)}
          />
          <Button
            type="button"
            label="Añadir opción"
            variantColor="variant1"
            className="w-40"
            onClick={() => appendOption({ value: '' })}
          />
        </div>
      </div>
    </div>
  );
}
