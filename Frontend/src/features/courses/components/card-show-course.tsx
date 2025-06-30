import React, { useState, useEffect } from 'react';
import { Button } from '../../../components';
import IconHour from '../icons/hour';
import IconCode from '../icons/code';
import IconQuizz from '../icons/quizz';
import { CourseSectionsList } from './section-course';
import Swal from 'sweetalert2';
import { postData } from '../../../services/api-service';
import { useFetchData } from '../../../hooks/use-fetch-data';
import { getCurrentUser } from '../../auth/services/auth.service';


const user = getCurrentUser();
const estudianteId = user?.profile_data?.id_estudiante;

if (!estudianteId) {
  Swal.fire({
    icon: 'warning',
    title: 'Acceso denegado',
    text: 'No estás logueado como estudiante',
    confirmButtonText: 'Aceptar'
  });
} else {
  console.log('ID del estudiante:', estudianteId);
}

type Props = {
  course: number;
  title: string;
  university: string;
  language: string;
  level: string;
  imageUrl: string;
  description: string;
  duration: string;
  practices: number;
  quizzes: number;
  tabs: {
    general: string;
    syllabus: {
      id_seccion: number;
      nombre_seccion: string;
      descripcion_seccion: string;
    }[];
    requirements: string;
  };
};

export const CardShowCourse: React.FC<Props> = ({
  course,
  title,
  university,
  language,
  level,
  imageUrl,
  description,
  duration,
  practices,
  quizzes,
  tabs,
}) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'syllabus' | 'requirements'
  >('general');
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { data: estudiantes, loading } = useFetchData<any[]>(
    `/users/estudiante/curso/${course}/`,
  );

  useEffect(() => {
    if (estudiantes) {
      const inscrito = estudiantes.some(
        (e) => e.id_estudiante === estudianteId,
      );
      setIsEnrolled(inscrito);
    }
  }, [estudiantes]);

  const handleEnroll = async () => {
    const payload = {
      estudiante_inscripcion: estudianteId,
      curso_inscripcion: course,
    };

    try {
      Swal.fire({
        title: 'Inscribiendo...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await postData('/education/inscribirse/', payload);
      Swal.close();

      if (
        response?.non_field_errors?.includes('Ya estás inscrito en este curso.')
      ) {
        Swal.fire({
          icon: 'info',
          title: 'Ya estás inscrito',
          text: 'No es necesario volver a inscribirte.',
        });
        setIsEnrolled(true);
        return;
      }

      Swal.fire({
        icon: 'success',
        title: '¡Inscripción exitosa!',
        text: 'Te has inscrito correctamente en el curso.',
      }).then(() => window.location.reload());
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'No se pudo completar la inscripción. Intenta más tarde.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto rounded-xl shadow-md overflow-hidden">
      <div className="bg-emerald-500 h-6 w-full rounded-t-2xl" />
      <div className="flex flex-col md:flex-row justify-between bg-white">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-center">
            <h4 className="text-medium font-roboto text-md text-blue-500 font-semibold">
              {university}
            </h4>
            <div className="flex gap-4 items-center">
              <span className="bg-emerald-500 text-slate-800 subtitle-sm px-4 py-2 rounded-lg">
                {language}
              </span>
              <span className="bg-emerald-500 text-slate-800 subtitle-sm px-4 py-2 rounded-lg">
                {level}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-2 text-slate-900">{title}</h1>
          <p className="body-md py-2">Inscríbete al curso:</p>

          <Button
            label={isEnrolled ? 'Inscrito' : 'Empieza ya'}
            className="w-36"
            onClick={handleEnroll}
            disabled={isEnrolled}
          />

          <div className="mt-6">
            <div className="grid gap-4 border-b mb-4 border-neutral-300 grid-cols-3">
              <button
                onClick={() => setActiveTab('general')}
                className={`pb-2 font-semibold text-slate-900 cursor-pointer ${activeTab === 'general' ? 'border-b-2 border-emerald-500' : ''}`}
              >
                Descripción general
              </button>
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`pb-2 font-semibold text-slate-900 cursor-pointer ${activeTab === 'syllabus' ? 'border-b-2 border-emerald-500' : ''}`}
              >
                Secciones
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`pb-2 font-semibold text-slate-900 cursor-pointer ${activeTab === 'requirements' ? 'border-b-2 border-emerald-500' : ''}`}
              >
                Quizzez
              </button>
            </div>

            <div className="text-sm text-slate-900 whitespace-pre-line">
              {activeTab === 'general' && tabs.general}
              {activeTab === 'syllabus' && (
                <CourseSectionsList
                  course={course}
                  sections={tabs.syllabus}
                  disabled={!isEnrolled}
                />
              )}
              {activeTab === 'requirements' && tabs.requirements}
            </div>
          </div>
        </div>

        <div className="relative bg-neutral-100 w-full md:w-96 md:ml-auto">
          <img
            src={imageUrl}
            alt="course"
            className="w-full h-96 object-cover"
          />

          <div className="absolute bottom-4 right-4 md:right-8 gap-6 bg-white/80 backdrop-blur-sm p-4 rounded shadow w-80 flex justify-around">
            <div className="flex flex-col items-center text-slate-900">
              <IconHour />
              <p className="font-medium text-sm ">{duration} horas</p>
            </div>
            <div className="flex flex-col items-center text-slate-900">
              <IconCode className="w-11 h-11" />
              <p className="font-medium text-sm">{practices} prácticas</p>
            </div>
            <div className="flex flex-col items-center text-slate-900">
              <IconQuizz className="w-11 h-11" />
              <p className="font-medium text-sm">{quizzes} quizzes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
