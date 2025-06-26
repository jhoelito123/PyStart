import { useNavigate } from 'react-router';
import IconCode from '../icons/code';
import IconFileText from '../icons/file-text';
import IconQuizz from '../icons/quizz';
import { StarRating } from './star-rating';

type CardCourseProps = {
  level: string;
  image: string;
  title: string;
  college: string;
  rating: number;
  votes: number;
  sections: number;
  practices: number;
  quizzez: number;
  link: string;
};

export default function CardCourse({
  level,
  image,
  title,
  college,
  rating,
  votes,
  sections,
  practices,
  quizzez,
  link,
}: CardCourseProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className="
        bg-white rounded-2xl shadow-xl overflow-hidden w-[360px] h-[340px] cursor-pointer
        hover:-translate-y-1
        transition-transform duration-300
      "
    >
      <div className="relative">
        <img src={image} alt={title} className="h-40 w-full object-cover" />
        <span className="absolute top-2 right-2 bg-emerald-500 text-white subtitle-sm px-4 py-1 rounded-lg">
          {level}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="subtitle-lg text-slate-900">
          {title.length > 60 ? title.slice(0, 60) + '...' : title}
        </h3>
        <p className="text-sm text-blue-500 font-medium">{college}</p>
        <div className="flex items-center space-x-1">
          <StarRating rating={Math.round(rating)} />

          <span className="subtitle-md text-slate-900 ml-1">
            {rating.toFixed(1)}
          </span>
          <span className="body-sm text-slate-800">({votes})</span>
        </div>
        <div className="flex justify-between text-sm text-emerald-500 mt-2">
          <div className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
            <IconFileText />
            <span>{sections} secciones</span>
          </div>
          <div className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
            <IconCode className="w-5 h-5" />
            <span>{practices} prácticas</span>
          </div>
          <div className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
            <IconQuizz className="w-5 h-5" />
            <span>{quizzez} quizzez</span>
          </div>
        </div>
      </div>
    </div>
  );
}
