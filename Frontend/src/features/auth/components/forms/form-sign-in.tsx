import { useForm } from 'react-hook-form';
import { InputText } from '../../../../components/ui/input';
import { LoginFormData, UserRole } from '../../interfaces/sign-in.interface';
import { Button } from '../../../../components';

interface FormSignInProps {
  isLoading: boolean;
  onSubmit: (data: LoginFormData) => void;
  selectedRole: UserRole;
}
export default function FormSignIn({
  isLoading,
  onSubmit,
  selectedRole,
}: FormSignInProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <InputText
          label="Correo electrónico"
          name="email"
          type="email"
          register={register}
          errors={errors}
          className="w-full"
          validationRules={{
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Ingrese un correo válido',
            },
          }}
        />
      </div>

      <div className="mb-5">
        <InputText
          label="Contraseña"
          name="password"
          type="password"
          register={register}
          errors={errors}
          className="w-full"
          validationRules={{
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 6,
              message: 'Debe tener al menos 6 caracteres',
            },
          }}
        />
      </div>

      <div className="mb-5">
        <Button
          label={
            isLoading
              ? 'Iniciando sesión...'
              : `Iniciar sesión como ${
                  selectedRole === 'estudiante'
                    ? 'Estudiante'
                    : selectedRole === 'docente'
                      ? 'Profesor'
                      : 'Administrador'
                }`
          }
          type="submit"
          disabled={isLoading}
          className={`flex w-full items-center justify-center px-8 py-3 font-medium rounded-lg ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        />
      </div>
    </form>
  );
}
