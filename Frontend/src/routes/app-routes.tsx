import { BrowserRouter, Route, Routes } from 'react-router';
import NavbarLayout from '../layouts/navbar-layout';
import RegisterInstPage from '../features/institution/pages/register-educational-institution';
import { RegisterCoursePage } from '../features/courses/pages/register-course';
import RegisterTeacherPage from '../features/teacher/pages/register-teacher';
import { RegisterSectionCoursePage } from '../features/courses/pages/register-section-course';
import CoursesPage from '../features/courses/pages/courses';
import ShowCoursePage from '../features/courses/pages/show-course';
import Ejecutor from '../features/courses/components/editor-code';
import MainLayout from '../features/landing/pages/landing-page';
import SigninPage from '../features/auth/components/sign-in';
import SignupPage from '../features/auth/components/sign-up';
import ShowSectionPage from '../features/courses/pages/show-section';
import RegisterQuizPage from '../features/quizzes/pages/register-quiz';
import ShowQuiz from '../features/quizzes/pages/show-quiz';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route index element={<MainLayout />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/register-inst-educational"
            element={<RegisterInstPage />}
          />
          <Route path="/register-teacher" element={<RegisterTeacherPage />} />
          <Route path="/register-course" element={<RegisterCoursePage />} />
          <Route
            path="/register-section-course"
            element={<RegisterSectionCoursePage />}
          />
          <Route path="/course" element={<CoursesPage />} />
          <Route path="/show-course/:id" element={<ShowCoursePage />} />
          <Route path="/show-section" element={<ShowSectionPage />} />
          <Route path="/code-editor" element={<Ejecutor />} />
          <Route path="/register-quiz" element={<RegisterQuizPage />} />
          <Route path="/show-quiz" element={<ShowQuiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
