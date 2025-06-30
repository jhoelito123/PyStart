import { postData } from '../../../services/api-service';

export interface EstudianteRegistrationData {
  user: {
    username_user: string;
    password_user: string;
    email_user: string;
    tipo_de_user: number;
  };
  nombre_estudiante: string;
  apellidos_estudiante: string;
  ci_estudiante: string;
  institucion_id: number;
}

export interface DocenteRegistrationData {
  user: {
    username_user: string;
    password_user: string;
    email_user: string;
    tipo_de_user: number;
  };
  nombre_docente: string;
  apellidos_docente: string;
  ci_docente: string;
  telefono_docente: number;
}

export interface LoginData {
  email_user: string;
  password_user: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
  username: string;
  email: string;
  tipo_de_usuario_loggeado: string;
  profile_data: Record<string, unknown>;
}

export const authService = {
  registerEstudiante: async (data: EstudianteRegistrationData) => {
    return await postData('/users/estudiante/register', data);
  },

  registerDocente: async (data: DocenteRegistrationData) => {
    return await postData('/users/docentes/register', data);
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    return await postData('/users/login/', data);
  },
};
