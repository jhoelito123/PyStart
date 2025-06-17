interface Option {
  value: string;
}

interface AnswerQuestionItemProps {
  question: string;
  options: Option[];
  index: number;
  register: any;
  errors: any;
}

export function CardShowQuestion({
  question,
  options,
  index,
  register,
  errors,
}: AnswerQuestionItemProps) {
  return (
    <div className="flex overflow-hidden rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="w-2 bg-emerald-500" />
      <div className="bg-white p-5 flex-1">
        <h3 className="subtitle-md text-slate-800 mb-4">
          <strong>
            {index + 1}. {question}
          </strong>
        </h3>
        <div className="space-y-3">
          {options.map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-2 border border-gray-200 rounded-md hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="radio"
                value={i}
                {...register(`answers.${index}`, {
                  required: 'Selecciona una opción',
                })}
                className="accent-blue-500"
              />
              <span className="body-md text-gray-900">{opt.value}</span>
            </label>
          ))}
        </div>
        {errors?.answers?.[index] && (
          <p className="text-red-400 text-sm mt-2">{errors.answers[index].message}</p>
        )}
      </div>
    </div>
  );
}
