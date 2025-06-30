import { Link } from 'react-router';

type PrevioCurso = {
  id_curso: number;
  nombre_curso: string;
  calificacion_curso: number;
  duracion_curso: string;
  descripcion_curso: string;
  portada_curso: string;
  fecha_inicio_curso: string;
  fecha_cierre_curso: string;
  profesor_curso: number;
  modulo_curso: number;
  idioma_curso: number;
  dificultad_curso: number;
};

const SingleBlog = ({ blog }: { blog: PrevioCurso }) => {
  const {
    nombre_curso,
    portada_curso,
    descripcion_curso,
    fecha_inicio_curso,
    fecha_cierre_curso,
  } = blog;
  return (
    <>
      <div
        className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
        data-wow-delay=".1s"
      >
        <Link
          to="/ruta/del/curso/byID"
          className="relative block w-full h-[200px] overflow-hidden"
        >
          <img
            src={portada_curso}
            alt={nombre_curso}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
          />
        </Link>

        <div className="p-6 sm:p-8 md:px-6 md:py-8 xl:px-5 xl:py-5 2xl:p-8">
          <h3 className="h-[65px] overflow-hidden">
            <Link
              to="/ruta/del/curso/byID"
              className="block text-xl font-bold text-black hover:text-primary sm:text-2xl line-clamp-2"
            >
              {nombre_curso}
            </Link>
          </h3>

          <p className="mb-3 border-b border-body-color border-opacity-10 pb-6 text-base text-body-color line-clamp-3 h-[79px]">
            {descripcion_curso}
          </p>

          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col items-center text-center border-r border-body-color border-opacity-10 pr-4 w-[45%]">
              <h4 className="mb-1 text-sm font-medium text-dark">
                Inicio de curso:
              </h4>
              <p className="text-xs text-body-color">{fecha_inicio_curso}</p>
            </div>
            <div className="flex flex-col items-center text-center  pr-4 w-[45%]">
              <h4 className="mb-1 text-sm font-medium text-dark">
                Fin del curso:
              </h4>
              <p className="text-xs text-body-color">{fecha_cierre_curso}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
