import { useNavigate } from 'react-router';

type CourseSectionsListProps = {
  sections: {
    id_seccion: number;
    nombre_seccion: string;
    descripcion_seccion: string;
  }[];
};

export const CourseSectionsList = ({ sections }: CourseSectionsListProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div>
          <h4 className="font-bold text-slate-800">
            Sección {section.id_seccion}
          </h4>
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 border border-neutral-200 cursor-pointer"
            onClick={() =>
              navigate(`/student/show-section/${section.id_seccion}`)
            }
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
