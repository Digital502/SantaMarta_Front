import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  UserCheck,
  ClipboardList,
  Archive,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_hermandad.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

export const NavbarUser = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const perfilRef = useRef();
  const navigate = useNavigate();
  const { logout, user } = useUserDetails();
  const getInitials = (name, lastname) => {
    const first = name?.[0] || "";
    const last = lastname?.[0] || "";
    return (first + last).toUpperCase();
  };

  const userInitials = getInitials(user?.nombre, user?.apellido);

  useEffect(() => {
    const handler = (e) => {
      if (!perfilRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full px-6 py-4 bg-[#142130] text-white shadow-lg border-b border-[#4F90C5]/30"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo + Nombre */}
        <Link to="/inicioMiembro" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Hermandad Logo"
            className="h-16 w-auto"
          />
        </Link>

        {/* Accesos rápidos */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/register-devoto" className="flex items-center gap-1 hover:text-[#4F90C5] transition">
            <UserCheck size={16} /> Registrar Devotos
          </Link>
          <Link to="/pago-turno" className="flex items-center gap-1 hover:text-[#4F90C5] transition">
            <ClipboardList size={16} /> Pago de Turnos
          </Link>
        </nav>

        {/* Icono de perfil */}
        <div className="relative" ref={perfilRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#59818B] bg-[#1e293b] text-[#59818B] font-bold text-5sm hover:bg-[#59818B]/10 transition"
            aria-label="Abrir menú de perfil"
          >
            {userInitials}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.aside
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed top-22 right-4 w-60 max-h-60 bg-[#1e293b] shadow-2xl border border-[#59818B]/40 z-50 rounded-xl overflow-auto"
              >
                {/* Encabezado */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-[#59818B]/20">
                  <p className="text-sm text-[#86AFB9] font-semibold">Tu Perfil</p>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-[#59818B] hover:text-[#86AFB9] text-lg font-bold"
                    aria-label="Cerrar menú de perfil"
                  >
                    ✕
                  </button>
                </div>

                {/* Opciones */}
                <div className="flex flex-col gap-1 px-4 py-3 text-sm text-[#E0E1DD]">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/configuracion/miperfil');
                    }}
                    className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#142130] transition"
                  >
                    <Settings size={16} className="text-[#59818B]" />
                    Configuración
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-red-500 hover:bg-red-900/30 transition"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};
