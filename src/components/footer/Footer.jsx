import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-[#142130] text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-base font-semibold mb-2">Redentordlc</h3>
            <p className="text-sm text-gray-300">
              Hermandad de Jesús Nazareno Redentor de los Cautivos<br />
              y Virgen de Dolores. Parroquia Santa Marta Zona 3
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">Contacto</h3>
            <p className="text-sm text-gray-300">
              contacto@redentordlc.org<br />
              +502 1234 5678
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">Redes Sociales</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-gray-400 transition">Facebook</a>
              <a href="#" className="hover:text-gray-400 transition">Instagram</a>
              <a href="#" className="hover:text-gray-400 transition">TikTok</a>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">Desarrollado por</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Digital Fact | Equipo Desarrollador
              Contacto: <a href="gmail:digitalfact25@gmail.com" className="text-blue-400 hover:underline">digitalfact25@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Hermandad Jesús Nazareno Redentor de los Cautivos. Todos los derechos reservados.
        </div>
      </footer>
  )
}
