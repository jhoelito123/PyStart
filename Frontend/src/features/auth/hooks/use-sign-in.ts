import { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { authService } from '../services/auth.service';
import { LoginFormData, UserRole } from '../interfaces/sign-in.interface';

export const useSignIn = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('estudiante');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Si es admin, usar credenciales por defecto
      if (selectedRole === 'admin') {
        if (
          data.email === 'admin@pystart.com' &&
          data.password === 'admin123'
        ) {
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem(
            'user',
            JSON.stringify({
              email: data.email,
              role: 'admin',
              username: 'Administrador',
            }),
          );

          await Swal.fire({
            icon: 'success',
            title: '¡Bienvenido Administrador!',
            text: 'Has iniciado sesión correctamente',
            timer: 2000,
            showConfirmButton: false,
          });

          navigate('/administrator');
        } else {
          setErrorMessage('Credenciales de administrador incorrectas');
        }
      } else {
        const loginResponse = await authService.login({
          email_user: data.email,
          password_user: data.password,
        });
        console.log(loginResponse)

        const userType = loginResponse.tipo_de_usuario_loggeado.toLowerCase();
        if (
          (selectedRole === 'estudiante' && userType === 'estudiante') ||
          (selectedRole === 'docente' && userType === 'docente')
        ) {
          localStorage.setItem(
            'userRole',
            selectedRole === 'estudiante' ? 'student' : 'teacher',
          );
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: loginResponse.user_id,
              email: loginResponse.email,
              username: loginResponse.username,
              role: selectedRole,
              profile_data: loginResponse.profile_data,
            }),
          );

          await Swal.fire({
            icon: 'success',
            title: `¡Bienvenido ${selectedRole === 'estudiante' ? 'Estudiante' : 'Profesor'}!`,
            text: `Hola ${loginResponse.username}, has iniciado sesión correctamente`,
            timer: 2000,
            showConfirmButton: false,
          });

          if (selectedRole === 'estudiante') {
            navigate('/student');
          } else {
            navigate('/teacher');
          }
        } else {
          setErrorMessage(
            `Este correo no corresponde a una cuenta de ${selectedRole}`,
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Invalid credentials') ||
          error.message.includes('404')
        ) {
          setErrorMessage('Correo o contraseña incorrectos');
        } else {
          setErrorMessage(
            'Error al iniciar sesión. Verifica tus credenciales.',
          );
        }
      } else {
        setErrorMessage('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedRole,
    setSelectedRole,
    isLoading,
    errorMessage,
    handleSubmit,
  };
};
