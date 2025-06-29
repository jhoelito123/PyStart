type ProgressCardProps = {
  nombre_curso: string;
  porcentaje_progreso: number;
  completado: boolean;
  fecha_inscripcion: string;
};

export const ProgressCard = ({
  nombre_curso,
  porcentaje_progreso,
  completado,
  fecha_inscripcion,
}: ProgressCardProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow p-5 mb-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {nombre_curso}
      </h3>
      <p className="text-sm text-slate-700 mb-1">
        Inscrito el: {new Date(fecha_inscripcion).toLocaleDateString()}
      </p>
      <div className="w-full bg-neutral-200 rounded-full h-3 mt-2 mb-2">
        <div
          className="bg-emerald-500 h-3 rounded-full"
          style={{ width: `${porcentaje_progreso}%` }}
        />
      </div>
      <p className="text-sm text-slate-800">
        Progreso: {porcentaje_progreso.toFixed(0)}% –{' '}
        {completado ? 'Completado ' : 'En curso '}
      </p>
    </div>
  );
};
