import { useForm, FormProvider } from 'react-hook-form';
import FormEducationalInstitution from '../components/form-educational-institution';

export default function RegisterInstPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <FormEducationalInstitution />
      </div>
    </FormProvider>
  );
}
