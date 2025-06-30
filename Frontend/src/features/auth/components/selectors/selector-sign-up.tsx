export default function SelectorUser({
  userType,
  setUserType,
}: {
  userType: 'estudiante' | 'docente';
  setUserType: (type: 'estudiante' | 'docente') => void;
}) {
  return (
    <div className="mb-6">
      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
        ¿Cómo quieres registrarte?
      </label>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setUserType('estudiante')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            userType === 'estudiante'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎓 Estudiante
        </button>
        <button
          type="button"
          onClick={() => setUserType('docente')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            userType === 'docente'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          👨‍🏫 Profesor
        </button>
      </div>
    </div>
  );
}
