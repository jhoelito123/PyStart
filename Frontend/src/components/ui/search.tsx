import IconClose from '../icons/close';

type SearchBarProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  query,
  onChangeQuery,
  placeholder = '¿Qué quieres aprender?',
}: SearchBarProps) {
  const clearInput = () => onChangeQuery('');

  return (
    <div className="relative w-96">
      <input
        type="text"
        value={query}
        onChange={(e) => onChangeQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {query && (
        <button
          onClick={clearInput}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-blue-600"
          aria-label="Limpiar búsqueda"
        >
          <IconClose className="w-6" />
        </button>
      )}
    </div>
  );
}
