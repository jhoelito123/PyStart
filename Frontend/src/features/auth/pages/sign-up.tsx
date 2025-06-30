import { Link } from 'react-router';
import SelectorUser from '../components/selectors/selector-sign-up';
import FormSignUp from '../components/forms/form-sign-up';
import { useSignUp } from '../hooks/use-sign-up';

const SignupPage = () => {
  const { userType, setUserType, isLoading, errorMessage, handleSubmit } =
    useSignUp();

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-15 md:pb-20">
        <div className="mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex justify-center items-center h-full">
              <img
                src="/images/sign-up.webp"
                alt="Decoración izquierda"
                className="w-[600px] h-[500px] max-w-sm object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="mx-auto max-w-[600px] w-full h-2 rounded-t-2xl bg-indigo-500" />
              <div className="mx-auto max-w-[600px] rounded bg-white px-8 py-8 shadow-lg">
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}

                <SelectorUser userType={userType} setUserType={setUserType} />

                <FormSignUp
                  userType={userType}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                />

                <p className="text-center text-base font-medium text-body-color">
                  ¿Ya tienes una cuenta? &emsp;
                  <Link to="/signin" className="text-primary hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignupPage;
