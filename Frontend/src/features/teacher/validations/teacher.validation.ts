import { TeacherFormData } from '../interfaces/teacher';

export const teacherValidationRules = {
  nombre_docente: {
    required: 'El nombre es obligatorio',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres',
    },
    pattern: {
      value: /^[a-zA-ZÀ-ÿ\s]+$/,
      message: 'El nombre solo puede contener letras y espacios',
    },
  },
  apellidos_docente: {
    required: 'El apellido es obligatorio',
    minLength: {
      value: 2,
      message: 'El apellido debe tener al menos 2 caracteres',
    },
    pattern: {
      value: /^[a-zA-ZÀ-ÿ\s]+$/,
      message: 'El apellido solo puede contener letras y espacios',
    },
  },
  ci_docente: {
    required: 'La cédula es obligatoria',
    pattern: {
      value: /^\d{1,9}$/,
      message: 'La cédula debe no tener mas de 9 dígitos',
    },
  },
  telefono_docente: {
    required: 'El número de celular es obligatorio',
    pattern: {
      value: /^\d{1,8}$/,
      message: 'El número de celular debe tener 8 dígitos',
    },
  },
  'user.username_user': {
    required: 'El nombre de usuario es obligatorio',
    minLength: {
      value: 3,
      message: 'El nombre de usuario debe tener al menos 3 caracteres',
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message:
        'El nombre de usuario solo puede contener letras, números y guiones bajos',
    },
  },
  'user.password_user': {
    required: 'La contraseña es obligatoria',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres',
    },
  },
  'user.email_user': {
    required: 'El correo electrónico es obligatorio',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Formato de correo electrónico inválido',
    },
  },
} as const;

export const getTeacherDefaultValues = (): TeacherFormData => ({
  user: {
    username_user: '',
    email_user: '',
    password_user: '',
    tipo_de_user: '',
  },
  nombre_docente: '',
  apellidos_docente: '',
  ci_docente: '',
  telefono_docente: '',
});
