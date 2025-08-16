import React from 'react'
import { NavbarAdmin } from '../../components/navs/NavbarAdmin'
import { NavbarUser } from '../../components/navs/NavbarUser'
import { Footer } from '../../components/footer/Footer'
import { ArrowRight, CreditCard, ClipboardList } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const PagoTurno = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const NavbarToShow = user?.role === "ROL_DIRECTIVO" ? <NavbarAdmin /> : <NavbarUser />
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {NavbarToShow}
      
      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#142130] mb-4">Pago de Turnos</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seleccione el tipo de turno que desea gestionar
            </p>
          </div>

          {/* Tarjetas de opciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opción Turno Ordinario */}
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => navigate('/pago-ordinario')}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-[#142130] transition-colors duration-300">
                  Turno Ordinario
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Gestión de pagos para turnos ordinarios asignados a devotos.
                </p>
                <div className="flex items-center text-[#142130] group-hover:text-blue-600 transition-colors duration-300">
                  <span className="font-medium">Acceder</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Opción Comisión */}
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => navigate('/pago-comision')}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  <ClipboardList className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-[#142130] transition-colors duration-300">
                  Comisión
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  Gestión de pagos para turnos de comisión asignados a devotos.
                </p>
                <div className="flex items-center text-[#142130] group-hover:text-green-600 transition-colors duration-300">
                  <span className="font-medium">Acceder</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}