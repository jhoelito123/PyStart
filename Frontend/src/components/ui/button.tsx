import { ButtonProps } from '../../interfaces';

export const Button = ({
  type = 'button',
  label,
  variantColor = 'variant1',
  onClick,
  disabled = false,
  icon: Icon,
  className = '',
}: ButtonProps) => {
  const baseButton =
    'button-lg rounded-[5px] h-10 pl-4 pr-5  text-center flex items-center whitespace-nowrap';

  const varCol: Record<string, string> = {
    variant1: 'text-white bg-blue-500 hover:bg-blue-600 cursor-pointer',
    variant2:
      'text-blue-500 bg-white border-[1px] border-blue-500 hover:bg-neutral-200 cursor-pointer',
    variant3: 'text-white bg-emerald-500 hover:bg-emerald-600 cursor-pointer',
    variant4:
      'text-white bg-transparent border-[1px] border-white hover:border-emerald-500 cursor-pointer hover:text-emerald-500',
    variantDesactivate: 'bg-blue-500 text-white opacity-40',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButton} ${varCol[variantColor]} ${className} flex items-center justify-center`}
    >
      {Icon && <Icon className="mr-0" />}
      <p className="pl-1 text-center text-wrap">{label}</p>
    </button>
  );
};
