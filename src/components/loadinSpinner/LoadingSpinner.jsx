import React from 'react';
import logo from '../../assets/logo_hermandad.png';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinner de líneas giratorias */}
        <div className="absolute w-40 h-40 border-t-4 border-b-4 border-[#4F90C5] border-opacity-30 rounded-full animate-spin"></div>
        <div className="absolute w-32 h-32 border-l-4 border-r-4 border-[#86AFB9] border-opacity-30 rounded-full animate-spin-slow"></div>

        {/* Contenedor central glassmorphism */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-4 shadow-xl">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28 object-contain rounded-full shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
