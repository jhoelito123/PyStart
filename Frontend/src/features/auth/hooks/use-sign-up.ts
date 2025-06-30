import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { authService } from '../services/auth.service';
import { FormData, UserType } from '../interfaces/sign-up.interface';

export const useSignUp = () => {
  const [userType, setUserType] = useState<UserType>('estudiante');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { reset } = useForm<FormData>();

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (userType === 'estudiante') {
        const estudianteData = {
          user: {
            username_user: data.username,
            password_user: data.password,
            email_user: data.email,
            tipo_de_user: 2,
          },
          nombre_estudiante: data.nombre_estudiante!,
          apellidos_estudiante: data.apellidos_estudiante!,
          ci_estudiante: data.ci_estudiante!,
          institucion_id: 1,
        };

        await authService.registerEstudiante(estudianteData);

        await Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: '¡Cuenta de estudiante creada exitosamente! Ya puedes iniciar sesión.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        const docenteData = {
          user: {
            username_user: data.username,
            password_user: data.password,
            email_user: data.email,
            tipo_de_user: 3,
          },
          nombre_docente: data.nombre_docente!,
          apellidos_docente: data.apellidos_docente!,
          ci_docente: data.ci_docente!,
          telefono_docente: parseInt(data.telefono_docente!),
        };

        await authService.registerDocente(docenteData);

        await Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: '¡Cuenta de profesor creada exitosamente! Ya puedes iniciar sesión.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#3b82f6',
        });
      }

      reset();
    } catch (error) {
      console.error('Error en registro:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al crear la cuenta',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userType,
    setUserType,
    isLoading,
    errorMessage,
    handleSubmit,
  };
};
