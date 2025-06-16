import { FieldValues, UseFormRegister, Path } from 'react-hook-form';

interface DropdownProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: Array<Record<string, string | number>>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  displayKey: string;
  valueKey: string;
  register?: UseFormRegister<T>;
  errors?: Record<string, { message: string }>;
  isRequired?: boolean;
}

export const Dropdown = <T extends FieldValues>({
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = '',
  displayKey,
  valueKey,
  register,
  errors = {},
  isRequired = true,
}: DropdownProps<T>) => {
  const getNestedError = (
    obj: Record<string, unknown>,
    path: string,
  ): { message: string } | undefined => {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return current as { message: string } | undefined;
  };

  const fieldError = getNestedError(errors, name);

  const registered = register?.(name, {
    required: isRequired ? `${label} es requerido` : false,
  });

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full">
        <select
          id={name}
          name={name}
          className={`
            peer w-full h-[50px] subtitle-sm text-slate-900
            border-b-[2px] border-neutral-500 rounded pt-6 pb-1 px-2
            focus:outline-none focus:border-slate-900 bg-transparent
            ${fieldError ? 'border-red-400' : ''}
          `}
          {...registered}
          value={value}
          onChange={(e) => {
            registered?.onChange(e); 
            onChange?.(e); 
          }}
        >
          <option
            value=""
            disabled
            className="bg-neutral-100 text-slate-500 subtitle-sm"
          >
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option
              key={index}
              value={option[valueKey]}
              className="bg-neutral-neu2 text-primary-pri2 subtitle-sm"
            >
              {displayKey === 'minutos'
                ? `${option[displayKey]} minutos`
                : option[displayKey]}
            </option>
          ))}
        </select>
        <label
          htmlFor={name}
          className="absolute left-2 text-slate-900 transition-all duration-200"
        >
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
      </div>

      <div className="min-h-[25px] text-start pl-2">
        {fieldError && (
          <span className="text-red-400 subtitle-sm text-wrap text-center">
            {fieldError.message}
          </span>
        )}
      </div>
    </div>
  );
};
