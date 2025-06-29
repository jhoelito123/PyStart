type Student = {
  id_estudiante: number;
  nombre_estudiante: string;
  apellidos_estudiante: string;
  ci_estudiante: string;
};

export default function CardStudent({ student }: { student: Student }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-neutral-200">
      <h3 className="text-slate-900 font-semibold text-lg">
        {student.nombre_estudiante} {student.apellidos_estudiante}
      </h3>
      <p className="text-sm text-neutral-600 mt-1">
        C.I.: {student.ci_estudiante}
      </p>
    </div>
  );
}
