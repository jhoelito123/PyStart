import { UserRole } from '../../interfaces/sign-in.interface';

export default function SelectorSignIn({
  selectedRole,
  setSelectedRole,
}: {
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-dark">
        Selecciona tu tipo de cuenta
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setSelectedRole('estudiante')}
          className={`py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
            selectedRole === 'estudiante'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎓 Estudiante
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole('docente')}
          className={`py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
            selectedRole === 'docente'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          👨‍🏫 Profesor
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole('admin')}
          className={`py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
            selectedRole === 'admin'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⚙️ Admin
        </button>
      </div>
    </div>
  );
}
