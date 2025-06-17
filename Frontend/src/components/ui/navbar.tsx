import { Link, useLocation } from 'react-router';
import IconLanguage from '../icons/language';
import { Button } from './button';
import IconBell from '../icons/bell';
import DropdownMenu from './dropdown-menu';

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

  return (
    <ul className="hidden lg:flex items-center justify-end w-screen space-x-12 mr-5 bg-slate-900">
      <li
        className={`${location.pathname === '/' ? 'text-emerald-500' : 'text-white'}`}
        ref={adminMenuRef}
      >
        <Link to="/" className="hover:text-emerald-600 subtitle-sm">
          Inicio
        </Link>
      </li>
      <li
        className={`${location.pathname === '/course' ? 'text-emerald-500' : 'text-white'}`}
        ref={adminMenuRef}
      >
        <Link to="/course" className="hover:text-emerald-600 subtitle-sm">
          Cursos
        </Link>
      </li>
      <DropdownMenu
        label="Administrador"
        options={[
          {
            label: 'Registro Institución Educativa',
            path: '/register-inst-educational',
          },
          { label: 'Registro Docente', path: '/register-teacher' },
          { label: 'Registro Curso', path: '/register-course' },
          { label: 'Registro Sección Curso', path: '/register-section-course' },
          { label: 'Registro Quiz', path: '/register-quiz' },
        ]}
      />
      <IconBell />
        <Link to="/signin">
          <Button label="Iniciar sesión" variantColor="variant4"/>
        </Link>
        <Link to="/signup">
          <Button label="Regístrate" variantColor="variant3" />
        </Link>
      <IconLanguage />
    </ul>
  );
}
