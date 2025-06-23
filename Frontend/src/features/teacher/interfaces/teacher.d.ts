export interface TeacherFormData {
  user: User;
  nombre_docente: string;
  apellidos_docente: string;
  ci_docente: string;
  telefono_docente: number;
}

export interface User {
  username_user: string;
  email_user: string;
  password_user: string;
}
