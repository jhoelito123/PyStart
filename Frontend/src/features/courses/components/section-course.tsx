import { useNavigate } from 'react-router';

type CourseSectionsListProps = {
  course: number;
  sections: {
    id_seccion: number;
    nombre_seccion: string;
    descripcion_seccion: string;
  }[];
  disabled?: boolean;
};

export const CourseSectionsList = ({
  course,
  sections,
  disabled = false,
}: CourseSectionsListProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div>
          <h4 className="font-bold text-slate-800">Sección {index + 1}</h4>
          <div
            className={`
              bg-white rounded-lg shadow p-4 border border-neutral-200
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-neutral-100'}
            `}
            onClick={() => {
              if (!disabled) {
                navigate(
                  `/student/course/${course}/section/${section.id_seccion}`,
                );
              }
            }}
            title={disabled ? 'Debes estar inscrito para acceder' : ''}
          >
            <h4 className="font-bold text-slate-800">
              {section.nombre_seccion}
            </h4>
            <p className="text-slate-700 text-sm mt-1 whitespace-pre-line">
              {section.descripcion_seccion}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
