import { FieldValues } from 'react-hook-form';
import { InputProps } from '../../interfaces';

export const InputText = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  className = '',
  labelPadding = '',
  register,
  errors,
  validationRules = {},
  isRequired = true,
  onInput,
  toUppercase = false,
}: InputProps<T> & { toUppercase?: boolean }) => {
  const isTextType = type === 'text';

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    if (toUppercase) {
      target.value = target.value.toUpperCase();
    }
    if (onInput) onInput(e);
  };

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
      <div className={`relative w-full ${className}`}>
        <input
          id={name as string}
          type={type}
          placeholder=" "
          className={`
            peer w-full h-[50px] subtitle-md text-slate-900 placeholder-transparent
            border-b-[2px] border-neutral-500 rounded pt-6 pb-1 px-2 
            focus:outline-none focus:border-slate-900
            ${fieldError ? 'border-red-400' : ''}
          `}
          {...(register ? register(name, validationRules) : {})}
          onInput={isTextType ? handleInput : onInput}
        />
        <label
          htmlFor={name as string}
          className={`
            absolute left-2 text-slate-900 transition-all duration-200
            peer-placeholder-shown:top-5 peer-placeholder-shown:subtitle-sm
            peer-focus:top-0 peer-focus:text-xs peer-focus:text-slate-900
            ${labelPadding}
            max-w-full overflow-hidden whitespace-nowrap text-ellipsis
          `}
        >
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      </div>

      <div className="min-h-[25px] text-start pl-2">
        {fieldError && (
          <span className="text-red-400 body-sm text-wrap text-center leading-none">
            {String((fieldError as Record<string, unknown>)?.message)}
          </span>
        )}
      </div>
    </div>
  );
};
