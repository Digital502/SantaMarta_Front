import React, { useState } from "react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { useTurno } from "../../shared/hooks/useTurno";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { Download, Users, ChevronDown, Loader2 } from "lucide-react";
import { pdfDatosDevotos } from "./pdfDatosDevotos";

export const DevotosByTurno = () => {
  const { procesiones } = useProcesion();
  const { turnosPorProcesion, fetchTurnosByProcesion } = useTurno();
  const { devotosPorTurno, fetchDevotosByTurno, loading } = useDevoto();

  const [procesionSeleccionada, setProcesionSeleccionada] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("");
  const [mostrarDevotos, setMostrarDevotos] = useState(false);

  const handleProcesionChange = (e) => {
    const id = e.target.value;
    setProcesionSeleccionada(id);
    setTurnoSeleccionado("");
    setMostrarDevotos(false);
    if (id) fetchTurnosByProcesion(id);
  };

  const handleVerDevotos = async () => {
    if (turnoSeleccionado) {
      await fetchDevotosByTurno(turnoSeleccionado);
      setMostrarDevotos(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarAdmin />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#426A73] to-[#2B535C] p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Users size={24} />
              Devotos por Turno
            </h1>
            <p className="text-gray-100 mt-1">
              Visualiza y gestiona los devotos asignados a cada turno
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {/* Selectores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Selector de Procesión */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Procesión
                </label>
                <div className="relative">
                  <select
                    value={procesionSeleccionada}
                    onChange={handleProcesionChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent rounded-lg shadow-sm appearance-none"
                  >
                    <option value="">Seleccione una procesión</option>
                    {procesiones.map((p) => (
                      <option key={p.uid} value={p.uid}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Selector de Turno */}
              {procesionSeleccionada && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Turno
                  </label>
                  <div className="relative">
                    <select
                      value={turnoSeleccionado}
                      onChange={(e) => setTurnoSeleccionado(e.target.value)}
                      disabled={!procesionSeleccionada}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent rounded-lg shadow-sm appearance-none disabled:bg-gray-50"
                    >
                      <option value="">Seleccione un turno</option>
                      {turnosPorProcesion.map((t) => (
                        <option key={t.uid} value={t.uid}>
                          {t.nombre || `Turno #${t.noTurno}`}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Ver Devotos */}
            {turnoSeleccionado && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={handleVerDevotos}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#426A73] to-[#2B535C] text-white hover:from-[#2B535C] hover:to-[#426A73] transition-all shadow-md flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Users size={20} />
                      Ver Devotos
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Lista de Devotos */}
            {mostrarDevotos && (
              <div className="border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#426A73]" />
                    <p className="mt-2 text-gray-600">Cargando devotos...</p>
                  </div>
                ) : devotosPorTurno.length > 0 ? (
                    <>
                        <div className="bg-gradient-to-r from-[#426A73] to-[#2B535C] px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users size={20} />
                            <span>Devotos del Turno Seleccionado ({devotosPorTurno.length})</span>
                        </h2>
                        </div>  
                        <ul className="divide-y divide-gray-100">
                        {devotosPorTurno.map((d, index) => (
                        <li
                            key={index}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div className="flex items-center justify-between">
                            {/* Info nombre y turno a la izquierda */}
                            <div>
                                <h3 className="font-medium text-gray-900 text-lg">{d.nombre}</h3>
                                <p className="text-sm text-gray-700">No. Turno: {d.noTurno}</p>
                            </div>

                            {/* Contraseña a la derecha, tamaño medio */}
                            <div className="text-lg font-semibold text-[#426A73] select-text">
                                {d.contraseña}
                            </div>
                            </div>
                        </li>
                        ))}
                        </ul>
                        <div className="bg-gray-50 px-6 py-4 border-t flex flex-wrap gap-3 justify-end">
                        <button className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#426A73] to-[#2B535C] text-white hover:from-emerald-600 hover:to-green-700 transition-all shadow-md flex items-center gap-2 text-sm font-medium">
                            <Download size={16} className="text-white/90" />
                            Descargar Contraseñas
                        </button>
                        <button 
                            onClick={() => pdfDatosDevotos(devotosPorTurno)}
                            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#426A73] to-[#2B535C] text-white hover:from-[#2B535C] hover:to-[#426A73] transition-all shadow-md flex items-center gap-2 text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Descargar Datos de Devoto
                        </button>
                        </div>
                    </>
                    ) : (
                  <div className="p-8 text-center">
                    <Users className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No se encontraron devotos
                    </h3>
                    <p className="mt-1 text-gray-500">
                      No hay devotos asignados a este turno.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};