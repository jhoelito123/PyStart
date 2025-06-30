import { BrowserRouter, Route, Routes } from 'react-router';
import NavbarLayout from '../layouts/navbar-layout';
import RegisterInstPage from '../features/institution/pages/register-educational-institution';
import { RegisterCoursePage } from '../features/courses/pages/register-course';
import RegisterTeacherPage from '../features/teacher/pages/register-teacher';
import { RegisterSectionCoursePage } from '../features/courses/pages/register-section-course';
import CoursesPage from '../features/courses/pages/courses';
import ShowCoursePage from '../features/courses/pages/show-course';
import MainLayout from '../features/landing/pages/landing-page';
import SignupPage from '../features/auth/pages/sign-up';
import ShowSectionPage from '../features/courses/pages/show-section';
import RegisterQuizPage from '../features/quizzes/pages/register-quiz';
import ShowQuiz from '../features/quizzes/pages/show-quiz';
import RegisterStudentPage from '../features/student/pages/register-student';
import { Home } from '../features/home/home';
import MyLearnPage from '../features/student/pages/my-learn';
import GenerateCertificate from '../features/certificate/pages/generate-certificate';
import CoursesTeacherPage from '../features/teacher/pages/courses-teacher';
import StudentsByCoursePage from '../features/teacher/pages/show-students';
import SigninPage from '../features/auth/pages/sign-in';
import EditCoursePage from '../features/teacher/pages/edit-course';
import ShowCourseSectionsPage from '../features/teacher/pages/show-course-sections';
import EditSectionPage from '../features/teacher/pages/edit-section';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route index element={<MainLayout />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Rutas para administrador */}
          <Route path="/administrator">
            <Route index element={<Home />} />
            <Route
              path="register-inst-educational"
              element={<RegisterInstPage />}
            />
            <Route path="register-teacher" element={<RegisterTeacherPage />} />
            <Route path="register-student" element={<RegisterStudentPage />} />
          </Route>

          {/* Rutas para docente */}
          <Route path="/teacher">
            <Route index element={<Home />} />
            <Route path="register-course" element={<RegisterCoursePage />} />
            <Route path="courses" element={<CoursesTeacherPage />} />
            <Route
              path="course/:id/students"
              element={<StudentsByCoursePage />}
            />
            <Route
              path="course/:id/edit"
              element={<EditCoursePage />}
            />
            <Route
              path="course/:id/sections"
              element={<ShowCourseSectionsPage />}
            />
            <Route
              path="section/:id/edit"
              element={<EditSectionPage />}
            />

            <Route
              path="register-section-course"
              element={<RegisterSectionCoursePage />}
            />
            <Route path="register-quiz" element={<RegisterQuizPage />} />
          </Route>

          {/* Rutas para estudiante */}
          <Route path="/student">
            <Route index element={<Home />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="course/:id" element={<ShowCoursePage />} />
            <Route
              path="course/:id_course/section/:id_section"
              element={<ShowSectionPage />}
            />
            <Route path="show-quiz" element={<ShowQuiz />} />
            <Route path="my-learn" element={<MyLearnPage />} />
            <Route path="certificado" element={<GenerateCertificate />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
