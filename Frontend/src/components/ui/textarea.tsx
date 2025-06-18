import { FieldValues } from 'react-hook-form';
import { InputProps } from '../../interfaces';

export const TextArea = <T extends FieldValues>({
  label,
  name,
  placeholder = '',
  className = '',
  labelPadding = '',
  register,
  errors,
  validationRules = {},
  isRequired = true,
  onInput,
}: InputProps<T>) => {
  const fieldError = name
    .split('.')
    .reduce(
      (acc: Record<string, unknown>, key: string) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      errors,
    );

  return (
    <div className="flex flex-col w-full">
      <div className={`w-full ${className}`}>
        <label
          htmlFor={name as string}
          className={`block text-slate-900 mb-1 px-2 ${labelPadding}`}
        >
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
        <div className='p-0 m-0 leading-none'>
        
          <textarea
            id={name as string}
            placeholder={placeholder}
            className={`
              w-full h-[70px] subtitle-md text-slate-900
              border-b-[2px] border-neutral-500 rounded
              px-2 pt-2 resize-none
              focus:outline-none focus:border-slate-900
              ${fieldError ? 'border-red-400' : ''}
            `}
            {...(register ? register(name, validationRules) : {})}
            onInput={onInput}
          />
        </div>
      </div>
      <div className="min-h-[25px] text-start pl-2">
        {fieldError && (
          <span className="text-red-400 body-sm text-wrap text-center">
            {String((fieldError as Record<string, unknown>)?.message)}
          </span>
        )}
      </div>
    </div>
  );
};
