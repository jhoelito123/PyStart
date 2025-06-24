import { TeacherFormData } from '../interfaces/teacher';

export class TeacherService {
  static transformToApiFormat(formData: TeacherFormData) {
    return {
      user: {
        username_user: formData.user.username_user,
        email_user: formData.user.email_user,
        password_user: formData.user.password_user,
        tipo_de_user: 3,
      },
      nombre_docente: formData.nombre_docente,
      apellidos_docente: formData.apellidos_docente,
      ci_docente: formData.ci_docente,
      telefono_docente: Number(formData.telefono_docente) || 0,
    };
  }
}
