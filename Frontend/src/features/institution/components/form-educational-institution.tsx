import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { InputText } from '../../../components/ui/input';
import { Button } from '../../../components';
import { Dropdown } from '../../../components/ui/dropdown';
import { useDepartamentos } from '../hooks/use-departamentos';
import { useProvincias } from '../hooks/use-provincias';
import { useNivelesEducativos } from '../hooks/use-niveles-educativos';
import { useCreateInstitucion } from '../hooks/use-create-institucion';

type SimpleFormData = {
  educationalInstitution: string;
  cod: string;
  departamento: string;
  provincia: string;
  dirección: string;
  nivel: string;
  correo: string;
};

export default function FormEducationalInstitution() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SimpleFormData>({
    mode: 'onChange',
    defaultValues: { departamento: '', provincia: '', nivel: '' },
  });

  const departamentoSeleccionado = useWatch({ control, name: 'departamento' });
  const departamentos = useDepartamentos();
  const provincias = useProvincias(departamentoSeleccionado);
  const niveles = useNivelesEducativos();
  const { create, loading } = useCreateInstitucion();

  useEffect(() => {
    setValue('provincia', '');
  }, [departamentoSeleccionado, setValue]);

  const onSubmit = (data: SimpleFormData) => {
    const payload = {
      admin_id: 1,
      nombre_institucion: data.educationalInstitution,
      codigo_institucion: data.cod,
      direccion: data.dirección,
      email_institucion: data.correo,
      provincia: Number(data.provincia),
      nivel_institucion: Number(data.nivel),
    };
    create(payload, reset);
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
            <div className="w-full mb-5">
              <h1 className="text-left text-slate-800 headline-lg">
                Registro de Instituciones Educativas
              </h1>
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Nombre de la Institución Educativa"
                name="educationalInstitution"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'El nombre de la institución es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'Debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'No puede tener más de 100 caracteres',
                  },
                }}
                errors={errors}
              />
              <InputText
                label="Código"
                name="cod"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'El código es obligatorio',
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Solo se permiten letras y números',
                  },
                  minLength: {
                    value: 2,
                    message: 'Debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 8,
                    message: 'No puede tener más de 8 caracteres',
                  },
                }}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full gap-20">
              <Dropdown
                name="departamento"
                label="Departamento"
                options={departamentos}
                placeholder="Seleccione un departamento"
                displayKey="nombre"
                valueKey="id"
                register={register}
                isRequired
              />

              <Dropdown
                name="provincia"
                label="Provincia"
                options={provincias}
                placeholder={
                  departamentoSeleccionado
                    ? 'Seleccione una provincia'
                    : 'Seleccione primero un departamento'
                }
                displayKey="nombre"
                valueKey="id"
                register={register}
                isRequired
              />
            </div>
            <div className="flex flex-row w-full gap-20">
              <InputText
                label="Dirección"
                name="dirección"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'La dirección es obligatoria',
                  minLength: {
                    value: 2,
                    message: 'Debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'No puede tener más de 50 caracteres',
                  },
                }}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full gap-20 mb-5">
              <Dropdown
                name="nivel"
                label="Nivel educativo"
                options={niveles}
                placeholder="Seleccione un nivel"
                displayKey="nombre"
                valueKey="id"
                register={register}
                isRequired
              />
              <InputText
                label="Correo electrónico"
                name="correo"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'El correo electrónico es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'Debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'No puede tener más de 50 caracteres',
                  },
                }}
                errors={errors}
              />
            </div>
            <div className="flex flex-row w-full justify-between">
              <Button
                label="Cancelar"
                variantColor="variant2"
                onClick={() => reset()}
              />
              <Button
                type="submit"
                label="Registrar"
                variantColor="variant1"
                disabled={loading}
                loading={loading}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-7/12">
            <img
              src="/assets/images/educational-institution.png"
              alt="imageInstitution"
              className="w-3xl"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
