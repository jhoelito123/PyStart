import { Link, Outlet } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/ui/navbar';
import IconClose from '../components/icons/close';
import IconHambur from '../components/icons/hambur';

export default function NavbarLayout() {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setIsAdminMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 bg-slate-900 h-[80px] flex items-center px-3 z-50">
        <div className="flex justify-between items-center w-full h-full">
          <Link
            to={
              userRole === 'admin'
                ? '/administrator'
                : userRole === 'student'
                  ? '/student'
                  : userRole === 'teacher'
                    ? '/teacher'
                    : ''
            }
            className="flex items-center"
          >
            <img src="/icons/pystart.png" alt="Logo" className="h-10 " />
          </Link>
          <Navbar
            isAdminMenuOpen={isAdminMenuOpen}
            setIsAdminMenuOpen={setIsAdminMenuOpen}
            adminMenuRef={adminMenuRef}
          />
          <div className="lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <IconClose className="w-8 h-8 cursor-pointer text-white" />
              ) : (
                <IconHambur className="w-8 h-8 cursor-pointer transition" />
              )}
            </button>
            {isMobileMenuOpen && (
              <div
                className="absolute top-full left-0 w-full bg-slate-900 shadow-lg rounded-b-md z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <ul>
                  {userRole === 'admin' && (
                    <>
                      {' '}
                      <li>
                        <Link
                          to="/administrator/register-inst-educational"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Registro Institución Educativa
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/administrator"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Inicio
                        </Link>
                      </li>
                    </>
                  )}
                  {userRole === 'teacher' && (
                    <>
                      {' '}
                      <li>
                        <Link
                          to="/teacher/register-course"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Registrar Curso
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/teacher/register-section-course"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Registro Sección de Curso
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/teacher/register-quiz"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Registro Quizz
                        </Link>
                      </li>
                    </>
                  )}
                  {userRole === 'student' && (
                    <>
                      {' '}
                      <li>
                        <Link
                          to="/student/courses"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Cursos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/student/my-learn"
                          className="block px-4 py-2 text-sm text-white hover:text-emerald-500"
                        >
                          Mi aprendizaje
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
