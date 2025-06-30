export type UserType = 'estudiante' | 'docente';

export interface FormData {
  username: string;
  email: string;
  password: string;

  nombre_estudiante?: string;
  apellidos_estudiante?: string;
  ci_estudiante?: string;

  nombre_docente?: string;
  apellidos_docente?: string;
  ci_docente?: string;
  telefono_docente?: string;
}
