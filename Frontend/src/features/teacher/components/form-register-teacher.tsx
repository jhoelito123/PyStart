import { useForm } from 'react-hook-form';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface TeacherFormData {
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  correo: string;
  celular: string;
}

export const FormRegisterTeacher = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    mode: 'onChange',
    defaultValues: {},
  });

  const onSubmit = (data: TeacherFormData) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col w-10/12 max-w-screen h-full my-10">
      <div className="w-full h-6 rounded-t-2xl bg-blue-500" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full justify-center shadow-2xl rounded-2xl p-10 bg-white mx-auto"
      >
        <div className="flex flex-row w-full max-w-11/12 mx-auto gap-32">
          <div className="flex flex-col gap-5 items-center justify-center w-full">
            <div className="w-full">
              <h1 className="text-left text-slate-800 headline-lg">
                Registrar Docente
              </h1>
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Nombres"
                name="nombres"
                className="w-full"
                register={register}
                validationRules={{ required: 'El nombre es obligatorio' }}
                errors={errors}
              />
              <InputText
                label="Apellidos"
                name="apellidos"
                className="w-full"
                register={register}
                validationRules={{ required: 'El apellido es obligatorio' }}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Cédula de Identidad"
                name="cedula"
                className="w-full"
                register={register}
                validationRules={{ required: 'La cédula es obligatoria' }}
                errors={errors}
              />
              <InputText
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                className="w-full"
                register={register}
                validationRules={{ required: 'La fecha es obligatoria' }}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Correo electrónico institucional"
                name="correo"
                className="w-full"
                register={register}
                validationRules={{ required: 'El correo es obligatorio' }}
                errors={errors}
                labelPadding="whitespace-nowrap"
              />
              <InputText
                label="Número de celular"
                name="celular"
                className="w-full"
                register={register}
                validationRules={{ required: 'El número es obligatorio' }}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full justify-between mt-4">
              <Button label="Cancelar" variantColor="variant2" type="button" />
              <Button label="Registrar" variantColor="variant1" type="submit" />
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
