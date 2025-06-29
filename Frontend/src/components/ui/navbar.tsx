import { Link, useLocation, useNavigate } from 'react-router';
import IconLanguage from '../icons/language';
import { Button } from './button';
import IconBell from '../icons/bell';
import { useEffect, useState } from 'react';

type NavbarProps = {
  isAdminMenuOpen: boolean;
  setIsAdminMenuOpen: (value: boolean) => void;
  adminMenuRef: React.RefObject<HTMLLIElement | null>;
};

export default function Navbar({
  isAdminMenuOpen,
  setIsAdminMenuOpen,
  adminMenuRef,
}: NavbarProps) {
  const location = useLocation();

  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentRole = localStorage.getItem('userRole');
      if (currentRole !== userRole) {
        setUserRole(currentRole);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userRole]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setIsAdminMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [adminMenuRef, setIsAdminMenuOpen]);

  return (
    <ul className="hidden lg:flex items-center justify-end w-screen space-x-12 mr-5 bg-slate-900">
      {userRole === 'user' && (
        <>
          {' '}
          <li
            className={`${location.pathname === '/' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link to="/" className="hover:text-emerald-600 subtitle-sm">
              Inicio
            </Link>
          </li>
          <IconBell />
          <Link to="/signin">
            <Button label="Iniciar sesión" variantColor="variant4" />
          </Link>
          <Link to="/signup">
            <Button label="Regístrate" variantColor="variant3" />
          </Link>
          <IconLanguage />
        </>
      )}
      {userRole === 'student' && (
        <>
          <li
            className={`${location.pathname === '/student' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link to="/student" className="hover:text-emerald-600 subtitle-sm">
              Inicio
            </Link>
          </li>
          <li
            className={`${location.pathname === '/student/courses' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/student/courses"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Cursos
            </Link>
          </li>
          <li
            className={`${location.pathname === '/student/my-learn' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/student/my-learn"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Mi aprendizaje
            </Link>
          </li>
          <Button
            onClick={() => {
              localStorage.setItem('userRole', 'user');
              navigate('/');
            }}
            label="Cerrar sesión"
          />
        </>
      )}
      {userRole === 'teacher' && (
        <>
          {' '}
          <li
            className={`${location.pathname === '/teacher' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link to="/teacher" className="hover:text-emerald-600 subtitle-sm">
              Inicio
            </Link>
          </li>
          <li
            className={`${location.pathname === '/teacher/register-course' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/teacher/register-course"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Registrar Curso
            </Link>
          </li>
          <li
            className={`${location.pathname === '/teacherregister-section-course' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/teacher/register-section-course"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Registrar Sección Curso
            </Link>
          </li>
          <li
            className={`${location.pathname === '/teacher/register-quiz' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/teacher/register-quiz"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Registrar Quizz
            </Link>
          </li>
          <li
            className={`${location.pathname === '/teacher/courses' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/teacher/courses"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Cursos
            </Link>
          </li>
          <Button
            onClick={() => {
              localStorage.setItem('userRole', 'user');
              navigate('/');
            }}
            label="Cerrar sesión"
          />
        </>
      )}
      {userRole === 'admin' && (
        <>
          {' '}
          <li
            className={`${location.pathname === '/administrator' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/administrator"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Inicio
            </Link>
          </li>
          <li
            className={`${location.pathname === '/administrator/register-inst-educational' ? 'text-emerald-500' : 'text-white'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/administrator/register-inst-educational"
              className="hover:text-emerald-600 subtitle-sm"
            >
              Registrar Institución Educativa
            </Link>
          </li>
          <Button
            onClick={() => {
              localStorage.setItem('userRole', 'user');
              navigate('/');
            }}
            label="Cerrar sesión"
          />
        </>
      )}
    </ul>
  );
}
