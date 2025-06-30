export interface ButtonProps {
  label: string;
  icon1?: React.ElementType;
  icon2?: React.ElementType;
  variantColor?:
    | 'variant1'
    | 'variant2'
    | 'variant3'
    | 'variant4'
    | 'variantText'
    | 'variantDesactivate';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  loadingText?: string;
}
