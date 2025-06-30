import SectionTitle from '../SectionTitle';
import SingleBlog from './SingleBlog';
import { useFetchData } from '../../../../hooks/use-fetch-data';
import { API_URL } from '../../../../config/api-config';

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

const Blog = () => {
  const {
    data: cursos,
    loading,
    error,
  } = useFetchData<PrevioCurso[]>(`${API_URL}/education/curso/`);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-emerald-600 text-2xl animate-spin flex items-center justify-center border-t-emerald-600 rounded-full"></div>
          </div>
        </div>

        <p className="mt-4 text-lg text-gray-600">Cargando cursos...</p>
      </div>
    );
  if (error) return <p className="p-4 text-red-500">Error al cargar cursos</p>;

  return (
    <section id="blog" className="bg-gray-light py-12 md:py-5">
      <div className="container">
        <SectionTitle
          title="Nuestros Cursos más recientes"
          paragraph="Encuentra el que más te interese e inscríbete ya !"
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {cursos &&
            cursos
              .slice(-3)
              .reverse()
              .map((blog) => (
                <div key={blog.id_curso} className="w-full">
                  <SingleBlog blog={blog} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
