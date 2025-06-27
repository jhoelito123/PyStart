import { ButtonProps } from '../../interfaces';

export const Button = ({
  type = 'button',
  label,
  variantColor = 'variant1',
  onClick,
  disabled = false,
  icon1: Icon1,
  icon2: Icon2,
  className = '',
  loading = false,
  loadingText = 'Cargando...',
}: ButtonProps) => {
  const baseButton =
    'button-lg rounded-[5px] h-10 pl-4 pr-5 text-center flex items-center whitespace-nowrap';

  const varCol: Record<string, string> = {
    variant1: 'text-white bg-blue-500 hover:bg-blue-600 cursor-pointer',
    variant2:
      'text-blue-500 bg-white border-[1px] border-blue-500 hover:bg-neutral-200 cursor-pointer',
    variant3: 'text-white bg-emerald-500 hover:bg-emerald-600 cursor-pointer',
    variant4:
      'text-white bg-transparent border-[1px] border-white hover:border-emerald-500 cursor-pointer hover:text-emerald-500',
    variantDesactivate: 'bg-blue-500 text-white opacity-40',
    variantText: 'text-blue-500 hover:underline hover:text-blue-600 cursor-pointer bg-transparent border-none',
  };

  const currentVariantColorClasses =
    loading || disabled
      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
      : varCol[variantColor];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseButton} ${currentVariantColorClasses} ${className} flex items-center justify-center transition-all duration-200`} // Añadí transition-all aquí para la suavidad
    >
      {loading ? (
        <>
          {<span className="animate-spin mr-2">↻</span>}
          <p className="pl-1 text-center text-wrap">{loadingText}</p>
        </>
      ) : (
        <>
          {Icon1 && <Icon1 className="mr-0" />}
          <p className="pl-1 text-center text-wrap">{label}</p>
          {Icon2 && <Icon2 className="mr-0" />}
        </>
      )}
    </button>
  );
};
