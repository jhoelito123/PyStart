import { Link } from 'react-router';
import SelectorSignIn from '../components/selectors/selector-sign-in';
import FormSignIn from '../components/forms/form-sign-in';
import { useSignIn } from '../hooks/use-sign-in';

const SigninPage = () => {
  const {
    selectedRole,
    setSelectedRole,
    isLoading,
    errorMessage,
    handleSubmit,
  } = useSignIn();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-7xl w-full flex items-center justify-center gap-20">
        <div className="hidden lg:flex lg:w-2/5 justify-center">
          <img
            src="/images/sign-in.webp"
            alt="Decoración de login"
            className="w-full max-w-xl h-auto object-contain"
          />
        </div>

        <div className="w-full lg:w-3/5 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="px-10 py-8 sm:px-14 sm:py-10">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                Inicia sesión en tu cuenta
              </h3>
              <p className="mb-6 text-center text-base font-medium text-body-color">
                Accede a la plataforma educativa
              </p>

              {errorMessage && (
                <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <SelectorSignIn
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />

              {selectedRole === 'admin' && (
                <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    Credenciales de administrador:
                  </p>
                  <p className="text-sm text-blue-600">
                    Email: admin@pystart.com
                  </p>
                  <p className="text-sm text-blue-600">Contraseña: admin123</p>
                </div>
              )}

              <FormSignIn
                isLoading={isLoading}
                onSubmit={handleSubmit}
                selectedRole={selectedRole}
              />

              <p className="text-center text-base font-medium text-body-color">
                ¿Todavía no tienes una cuenta? &emsp;
                <Link to="/signup" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
