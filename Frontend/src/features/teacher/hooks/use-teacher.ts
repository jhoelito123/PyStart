import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TeacherFormData } from '../interfaces/teacher';
import {
  getTeacherDefaultValues,
  teacherValidationRules,
} from '../validations/teacher.validation';
import { useApiForm } from '../../../hooks';
import { API_URL } from '../../../config/api-config';
import { TeacherService } from '../services/teacher.service';
import Swal from 'sweetalert2';

export const useTeacherForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeacherFormData>({
    mode: 'onChange',
    defaultValues: getTeacherDefaultValues(),
  });

  const { submitForm } = useApiForm(`${API_URL}/users/docentes/register`);

  const handleSubmit = async (formData: TeacherFormData) => {
    try {
      setIsSubmitting(true);
      Swal.fire({
        title: 'Registrando docente...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // Transformar formData a formato API
      const apiData = TeacherService.transformToApiFormat(formData);
      // Enviar datos a la API
      await submitForm(apiData);
      Swal.fire({
        title: 'Éxito',
        text: 'Docente registrado exitosamente',
        icon: 'success',
      });
      form.reset(getTeacherDefaultValues());
    } catch (error) {
      console.error('Error al registrar docente:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al registrar docente. Por favor, intente nuevamente.',
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    ...form,
    isSubmitting,
    onSubmit: handleSubmit,
    validationRules: teacherValidationRules,
  };
};
