import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

export const NoAutorizado = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#0D1B2A] to-[#0D1B2A] text-white px-6">
      <div className="bg-white text-[#2B535C] rounded-2xl shadow-lg p-10 max-w-lg w-full text-center animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="bg-[#2B535C] p-4 rounded-full shadow-lg">
            <Lock size={50} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-lg text-gray-700 mb-6">
          No tienes permisos para acceder a esta sección. Si crees que esto es un error, 
          contacta con el administrador del sistema.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#426A73] hover:bg-[#2B535C] text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>
    </div>
  );
};
