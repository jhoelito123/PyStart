import { useForm } from 'react-hook-form';
import { InputText } from '../../../../components/ui/input';
import { Button } from '../../../../components';
import { FormData } from '../../interfaces/sign-up.interface';
interface FormSignUpProps {
  userType: 'estudiante' | 'docente';
  isLoading: boolean;
  onSubmit: (data: FormData) => void;
}

export default function FormSignUp({
  userType,
  isLoading,
  onSubmit,
}: FormSignUpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText
          label="Nombre de usuario"
          name="username"
          register={register}
          errors={errors}
          className="w-full"
          validationRules={{
            required: 'El nombre de usuario es obligatorio',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 30,
              message: 'No puede tener más de 30 caracteres',
            },
          }}
        />
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

      <div className="mb-4">
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

      {userType === 'estudiante' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <InputText
            label="Nombre"
            name="nombre_estudiante"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'El nombre es obligatorio',
              maxLength: {
                value: 30,
                message: 'No puede tener más de 30 caracteres',
              },
            }}
          />
          <InputText
            label="Apellidos"
            name="apellidos_estudiante"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'Los apellidos son obligatorios',
              maxLength: {
                value: 30,
                message: 'No puede tener más de 30 caracteres',
              },
            }}
          />
          <InputText
            label="Cédula de Identidad"
            name="ci_estudiante"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'La cédula es obligatoria',
              pattern: {
                value: /^\d{7,9}$/,
                message: 'Ingrese una cédula válida (7-9 dígitos)',
              },
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputText
            label="Nombre"
            name="nombre_docente"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'El nombre es obligatorio',
              maxLength: {
                value: 30,
                message: 'No puede tener más de 30 caracteres',
              },
            }}
          />
          <InputText
            label="Apellidos"
            name="apellidos_docente"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'Los apellidos son obligatorios',
              maxLength: {
                value: 30,
                message: 'No puede tener más de 30 caracteres',
              },
            }}
          />
          <InputText
            label="Cédula de Identidad"
            name="ci_docente"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'La cédula es obligatoria',
              pattern: {
                value: /^\d{7,9}$/,
                message: 'Ingrese una cédula válida (7-9 dígitos)',
              },
            }}
          />
          <InputText
            label="Teléfono"
            name="telefono_docente"
            register={register}
            errors={errors}
            className="w-full"
            validationRules={{
              required: 'El teléfono es obligatorio',
              pattern: {
                value: /^\d{8}$/,
                message: 'Ingrese un teléfono válido (8 dígitos)',
              },
            }}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="flex cursor-pointer select-none text-sm font-medium text-body-color">
          <input
            type="checkbox"
            className="mr-3 mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            required
          />
          <span>
            Al crear la cuenta, usted acepta los términos y condiciones
          </span>
        </label>
      </div>

      <div className="mb-4">
        <Button
          label={
            isLoading
              ? 'Registrando...'
              : `Registrarse como ${userType === 'estudiante' ? 'Estudiante' : 'Profesor'}`
          }
          type="submit"
          disabled={isLoading}
          className={`flex w-full items-center justify-center px-9 py-4 font-medium rounded-sm ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        />
      </div>
    </form>
  );
}
