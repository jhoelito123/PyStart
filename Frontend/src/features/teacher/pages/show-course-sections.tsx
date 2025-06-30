import { useParams } from 'react-router';
import { CourseSectionsList } from '../components/course-sections-list';

export default function ShowCourseSectionsPage() {
  const { id } = useParams(); // id del curso

  return (
    <div className="h-full w-full">
      <CourseSectionsList courseId={parseInt(id || '0')} />
    </div>
  );
} 