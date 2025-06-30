import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useTeacherForm } from '../hooks/use-teacher';

export const FormRegisterTeacher = () => {
  const {
    register,
    handleSubmit,
    isSubmitting,
    validationRules,
    onSubmit,
    formState: { errors, isValid },
  } = useTeacherForm();

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />{' '}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full justify-center shadow-2xl rounded-2xl p-10 bg-white mx-auto"
      >
        <div className="flex flex-row w-full max-w-11/12 mx-auto gap-32">
          <div className="flex flex-col gap-5 w-full">
            <div className="w-full">
              <h1 className="text-left text-slate-800 headline-lg">
                Registrar Docente
              </h1>
            </div>{' '}
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Nombres"
                name="nombre_docente"
                className="w-full"
                register={register}
                validationRules={validationRules.nombre_docente}
                errors={errors}
              />
              <InputText
                label="Apellidos"
                name="apellidos_docente"
                className="w-full"
                register={register}
                validationRules={validationRules.apellidos_docente}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Cédula de Identidad"
                name="ci_docente"
                className="w-full"
                register={register}
                validationRules={validationRules.ci_docente}
                errors={errors}
              />
              <InputText
                label="Número de celular"
                name="telefono_docente"
                className="w-full"
                register={register}
                validationRules={validationRules.telefono_docente}
                errors={errors}
              />
            </div>
            <div className="flex flex-row gap-20 w-full">
              <InputText
                label="Nombre de usuario"
                name="user.username_user"
                className="w-full"
                register={register}
                validationRules={validationRules['user.username_user']}
                errors={errors}
              />
              <InputText
                label="Contraseña"
                name="user.password_user"
                type="password"
                className="w-full"
                register={register}
                validationRules={validationRules['user.password_user']}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Correo electrónico"
                name="user.email_user"
                type="email"
                className="w-full"
                register={register}
                validationRules={validationRules['user.email_user']}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full justify-between mt-4">
              <Button label="Cancelar" variantColor="variant2" type="button" />
              <Button
                label={isSubmitting ? 'Registrando...' : 'Registrar'}
                variantColor={isSubmitting ? 'variantDesactivate' : 'variant1'}
                type="submit"
                disabled={!isValid || isSubmitting}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-7/12">
            <img
              src="/assets/images/educational-institution.png"
              alt="docente"
              className="w-3xl"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
