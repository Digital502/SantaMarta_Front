import React, { useState, useEffect } from "react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useCompra } from "../../shared/hooks/useCompra";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { useTurno } from "../../shared/hooks/useTurno";
import toast from "react-hot-toast";
import { Search, ChevronDown, Loader2, Check, AlertTriangle } from "lucide-react";
import { NavbarUser } from "../navs/NavbarUser";

export const RegistrarCompra = () => {
  const { createCompra, loading, verFactura } = useCompra();
  const { devotos, fetchDevotos } = useDevoto();
  const { procesiones, fetchProcesiones } = useProcesion();
  const { turnosPorProcesion, fetchTurnosByProcesion } = useTurno();
  const user = JSON.parse(localStorage.getItem("user"));
  const NavbarToShow = user?.role === "ROL_DIRECTIVO" ? <NavbarAdmin /> : <NavbarUser />;
  
  const [form, setForm] = useState({
    procesion: "",
    devoto: "",
    turno: "",
    pago: "COMPLETO",
  });

  const [searchInputs, setSearchInputs] = useState({
    devoto: "",
    turno: ""
  });

  const [filteredDevotos, setFilteredDevotos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [showDevotoList, setShowDevotoList] = useState(false);
  const [showTurnoList, setShowTurnoList] = useState(false);

  useEffect(() => {
    fetchProcesiones();
    fetchDevotos();
  }, []);

  const handleDevotoSearch = (value) => {
    setSearchInputs({...searchInputs, devoto: value});
    setFilteredDevotos(
      devotos.filter(d => 
        `${d.nombre} ${d.apellido} ${d.DPI}`.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowDevotoList(value.length > 0);
  };

  const handleTurnoSearch = (value) => {
    setSearchInputs({...searchInputs, turno: value});
    setFilteredTurnos(
      turnosPorProcesion.filter(t => 
        `${t.noTurno} - ${t.marcha}`.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowTurnoList(value.length > 0);
  };

  const handleProcesionChange = (e) => {
    const id = e.target.value;
    setForm({...form, procesion: id, turno: ""});
    setSearchInputs({...searchInputs, turno: ""});
    if (id) fetchTurnosByProcesion(id);
  };

  // Seleccionar turno
  const handleSelectTurno = (turnoId) => {
    const turno = turnosPorProcesion.find(t => t.uid === turnoId);
    if (!turno) return;
    
    if (turno.cantidadSinVender === 0) {
      toast.error("Este turno ya no está disponible.");
      return;
    }
    
    if (turno.cantidadSinVender <= 3) {
      toast(`Solo quedan ${turno.cantidadSinVender} turnos disponibles`, { 
        icon: <AlertTriangle className="text-yellow-500" /> 
      });
    }
    
    setForm({...form, turno: turnoId});
    setSearchInputs({...searchInputs, turno: `${turno.noTurno} - ${turno.marcha}`});
    setShowTurnoList(false);
  };

  // Seleccionar devoto
  const handleSelectDevoto = (devoto) => {
    setForm({...form, devoto: devoto._id});
    setSearchInputs({...searchInputs, devoto: `${devoto.nombre} ${devoto.apellido} - ${devoto.DPI}`});
    setShowDevotoList(false);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.devoto || !form.turno) {
      toast.error("Debes seleccionar devoto y turno");
      return;
    }
    
    const res = await createCompra({
      devoto: form.devoto,
      turno: form.turno,
      pago: form.pago,
    });

    if (res && !res.error) {
      if (res.compra?.noFactura) {
        verFactura(res.compra?.noFactura);
      }
      resetForm();
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({
      procesion: "",
      devoto: "",
      turno: "",
      pago: "COMPLETO",
    });
    setSearchInputs({
      devoto: "",
      turno: ""
    });
    setFilteredDevotos([]);
    setFilteredTurnos([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7fa] to-[#e0f0f5]">
      {NavbarToShow}
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Encabezado */}
          <div className="bg-[#426A73] p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Check className="hidden md:block" size={28} />
              Compra Turno Ordinario
            </h1>
            <p className="text-[#e0f0f5] mt-1">Complete los datos requeridos para registrar una compra</p>
          </div>
          <br />
            <p className="text-1lx italic text-center text-[#2B535C]">
                “La Misa es el acto de adoración más perfecto que podemos ofrecer a Dios”<br />
                <span className="not-italic font-medium">— San Francisco de Sales</span>
            </p>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Procesión */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Procesión *</label>
              <div className="relative">
                <select
                  value={form.procesion}
                  onChange={handleProcesionChange}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">Seleccione una procesión...</option>
                  {procesiones.map(p => (
                    <option key={p.uid} value={p.uid}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Devoto */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-semibold text-gray-700">Devoto *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  value={searchInputs.devoto}
                  onChange={(e) => handleDevotoSearch(e.target.value)}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition"
                  placeholder="Buscar por nombre, apellido o DPI..."
                  required
                />
              </div>
              
              {showDevotoList && filteredDevotos.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                  {filteredDevotos.map(d => (
                    <li
                      key={d.uid}
                      onClick={() => handleSelectDevoto(d)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{d.nombre} {d.apellido}</p>
                        <p className="text-sm text-gray-500">{d.DPI}</p>
                      </div>
                      {form.devoto === d.uid && (
                        <Check className="text-[#426A73]" size={18} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Turno */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-semibold text-gray-700">Turno *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  value={searchInputs.turno}
                  onChange={(e) => handleTurnoSearch(e.target.value)}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition disabled:bg-gray-100"
                  placeholder={form.procesion ? "Buscar por número o marcha..." : "Seleccione una procesión primero"}
                  disabled={!form.procesion}
                  required
                />
              </div>
              
              {showTurnoList && filteredTurnos.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                  {filteredTurnos.map(t => (
                    <li
                      key={t.uid}
                      onClick={() => handleSelectTurno(t.uid)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">Turno #{t.noTurno}</p>
                          <p className="text-sm text-gray-600">{t.marcha}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          t.cantidadSinVender > 3 
                            ? "bg-green-100 text-green-800" 
                            : t.cantidadSinVender > 0 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {t.cantidadSinVender} disponibles
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.direccion}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Botones */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Limpiar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-bold transition flex items-center justify-center ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#426A73] hover:bg-[#2B535C]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Procesando...
                  </>
                ) : (
                  "Registrar Compra"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};