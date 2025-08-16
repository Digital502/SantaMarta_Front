import React from "react";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/564/564619.png" 
        alt="Página no encontrada"
        className="w-48 h-48 mb-8 animate-pulse"
      />
      <h1 className="text-6xl font-extrabold text-[#426A73] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        ¡Oops! Página no encontrada
      </h2>
      <p className="text-center max-w-md text-gray-500 mb-8">
        La página que buscas no existe o fue movida. Verifica la URL o regresa al inicio.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 rounded-lg bg-[#426A73] text-white font-bold hover:bg-[#2B535C] transition"
      >
        Volver al inicio
      </a>
    </div>
  );
};
