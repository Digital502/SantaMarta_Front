import React, { useState, useEffect } from "react";
import { Search, User, Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { useTurno } from "../../shared/hooks/useTurno";
import { useReserva } from "../../shared/hooks/useReserva";
import { useCompra } from "../../shared/hooks/useCompra";
import { toast } from "react-hot-toast";

export const ReservaTurno = () => {
  const { devotos, fetchDevotoById, devoto } = useDevoto();
  const { procesiones, fetchProcesiones } = useProcesion();
  const { turnosPorProcesion, fetchTurnosByProcesion } = useTurno();
  const { reservar, loading: loadingReserva } = useReserva();
  const { verFactura } = useCompra();

  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [devotoSeleccionado, setDevotoSeleccionado] = useState("");
  const [procesionSeleccionada, setProcesionSeleccionada] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("");
  const [tipoReserva, setTipoReserva] = useState("");

  // Filtrar devotos
  useEffect(() => {
    if (!busqueda.trim()) return setSugerencias([]);
    const term = busqueda.toLowerCase();

    const filtrados = devotos.filter((d) => {
      const nombre = d.nombre?.toLowerCase() || "";
      const apellido = d.apellido?.toLowerCase() || "";
      const dpi = d.DPI?.toLowerCase() || "";
      const nombreCompleto = `${nombre} ${apellido}`.trim();
      return (
        nombre.includes(term) ||
        apellido.includes(term) ||
        nombreCompleto.includes(term) ||
        dpi.includes(term)
      )
    });

    setSugerencias(filtrados);
  }, [busqueda, devotos]);

  // Cargar devoto
  useEffect(() => {
    if (devotoSeleccionado) {
      fetchDevotoById(devotoSeleccionado);
      setProcesionSeleccionada("");
      setTurnoSeleccionado("");
      setTipoReserva("");
    }
  }, [devotoSeleccionado]);

  // Cargar turnos por procesión
  useEffect(() => {
    if (procesionSeleccionada) {
      fetchTurnosByProcesion(procesionSeleccionada);
      setTurnoSeleccionado("");
      setTipoReserva("");
    }
  }, [procesionSeleccionada]);

  // Filtrar turnos ordinarios
  const turnosOrdinarios = turnosPorProcesion.filter(
    (t) => t.tipoTurno?.toUpperCase() === "ORDINARIO"
  );

  const handleReservar = async () => {
    if (!devotoSeleccionado || !turnoSeleccionado || !tipoReserva) {
      toast.error("Debe completar todos los pasos");
      return;
    }

    const payload = {
      devotoId: devotoSeleccionado,
      turnoId: turnoSeleccionado,
      tipoReserva,
    };

    const res = await reservar(payload);

    if (res.error) {
      toast.error(res.e?.response?.data?.error || "Error al reservar turno");
    } else {
      toast.success("Turno reservado correctamente");
      setProcesionSeleccionada("");
      setTurnoSeleccionado("");
      setTipoReserva("");
      verFactura(res.compra?.noFactura)
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarAdmin />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {/* Encabezado */}
          <div className="bg-[#142130] p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Reserva de Turnos
            </h1>
            <p className="opacity-90">Complete los datos para reservar un turno ordinario</p>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Paso 1: Buscar devoto */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-[#142130]">
                <User className="h-5 w-5" />
                Paso 1: Seleccionar Devoto
              </h2>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142130] focus:border-transparent"
                  placeholder="Buscar por nombre, apellido o DPI..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {/* Sugerencias */}
              {sugerencias.length > 0 && (
                <ul className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {sugerencias.map((d) => (
                    <li
                      key={d._id}
                      className="p-3 hover:bg-[#142130]/5 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setDevotoSeleccionado(d._id);
                        setSugerencias([]);
                        setBusqueda(`${d.nombre} ${d.apellido}`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#142130]/10 p-2 rounded-full">
                          <User className="h-4 w-4 text-[#142130]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#142130]">{d.nombre} {d.apellido}</p>
                          <p className="text-sm text-gray-600">DPI: {d.DPI}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Datos del devoto */}
            {devoto && (
              <div className="bg-[#142130]/5 p-4 rounded-lg border border-[#142130]/10">
                <h3 className="font-semibold text-[#142130] mb-2">Devoto seleccionado:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre completo</p>
                    <p className="font-medium text-[#142130]">{devoto.nombre} {devoto.apellido}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Documento (DPI)</p>
                    <p className="font-medium text-[#142130]">{devoto.DPI}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-[#142130]">{devoto.telefono}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Seleccionar procesión */}
            {devoto && procesiones.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-[#142130]">
                  <Calendar className="h-5 w-5" />
                  Paso 2: Seleccionar Procesión
                </h2>
                
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#142130] focus:border-transparent"
                    value={procesionSeleccionada}
                    onChange={(e) => setProcesionSeleccionada(e.target.value)}
                  >
                    <option value="">-- Seleccione una procesión --</option>
                    {procesiones.map((p) => (
                      <option key={p.uid} value={p.uid}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Paso 3: Seleccionar turno */}
            {procesionSeleccionada && turnosOrdinarios.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-[#142130]">
                  <Clock className="h-5 w-5" />
                  Paso 3: Seleccionar Turno Ordinario
                </h2>
                
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#142130] focus:border-transparent"
                    value={turnoSeleccionado}
                    onChange={(e) => setTurnoSeleccionado(e.target.value)}
                  >
                    <option value="">-- Seleccione un turno --</option>
                    {turnosOrdinarios.map((t) => (
                      <option key={t.uid} value={t.uid}>
                        Turno {t.noTurno} - {t.marcha}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Paso 4: Tipo de reserva */}
            {turnoSeleccionado && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-[#142130]">
                  <CheckCircle className="h-5 w-5" />
                  Paso 4: Tipo de Reserva
                </h2>
                
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#142130] focus:border-transparent"
                    value={tipoReserva}
                    onChange={(e) => setTipoReserva(e.target.value)}
                  >
                    <option value="">-- Seleccione el tipo --</option>
                    <option value="COMPLETO">Completo</option>
                    <option value="MEDIO">Medio turno</option>
                  </select>
                  <CheckCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Botón de reserva */}
            {tipoReserva && (
              <button
                className={`w-full py-3 px-4 bg-[#142130] hover:bg-[#142130]/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  loadingReserva ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={handleReservar}
                disabled={loadingReserva}
              >
                {loadingReserva ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando reserva...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Confirmar Reserva
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};