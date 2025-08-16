import React, { useState, useEffect } from "react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { NavbarUser } from "../navs/NavbarUser";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { useTurno } from "../../shared/hooks/useTurno";
import { validateDPI, validateDPIMessage, validateEmail, validateEmailMessage } from "../../shared/validators";
import { Plus, Trash, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export const RegisterDevoto = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const NavbarToShow = user?.role === "ROL_DIRECTIVO" ? <NavbarAdmin /> : <NavbarUser />;
  const isDirectivo = user?.role === "ROL_DIRECTIVO";

  const { createDevoto, loading } = useDevoto();
  const { procesiones, fetchProcesiones } = useProcesion();
  const { turnosPorProcesion, fetchTurnosByProcesion } = useTurno();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    DPI: "",
    email: "",
    telefono: "",
    ...(isDirectivo && {
      procesion: "",
      turnosSeleccionados: []
    })
  });

  const [errors, setErrors] = useState({});
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [showCodigoSection, setShowCodigoSection] = useState(false);

  useEffect(() => {
    fetchProcesiones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "procesion") {
      fetchTurnosByProcesion(value);
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const toggleTurnoModal = () => {
    setShowTurnoModal(!showTurnoModal);
  };

  const toggleCodigoSection = () => {
    setShowCodigoSection(!showCodigoSection);
  };

  const agregarTurno = (turno) => {
    if (!formData.turnosSeleccionados.some(t => t.uid === turno.uid)) {
      setFormData(prev => ({
        ...prev,
        turnosSeleccionados: [...prev.turnosSeleccionados, turno]
      }));
    }
  };

  const eliminarTurno = (turnoId) => {
    setFormData(prev => ({
      ...prev,
      turnosSeleccionados: prev.turnosSeleccionados.filter(t => t.uid !== turnoId)
    }));
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) tempErrors.apellido = "El apellido es requerido";
    if (!validateDPI(formData.DPI)) tempErrors.DPI = validateDPIMessage;
    if (!validateEmail(formData.email)) tempErrors.email = validateEmailMessage;
    if (!formData.telefono.trim()) tempErrors.telefono = "El teléfono es requerido";
    else if (formData.telefono.length < 8) tempErrors.telefono = "El teléfono debe tener al menos 8 caracteres";
    
    if (isDirectivo && showCodigoSection) {
      if (!formData.procesion) tempErrors.procesion = "Debes seleccionar una procesión";
      if (formData.turnosSeleccionados.length === 0) tempErrors.turnos = "Debes seleccionar al menos un turno";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  // Preparar los datos para enviar
  const data = {
    nombre: formData.nombre,
    apellido: formData.apellido,
    DPI: formData.DPI,
    email: formData.email,
    telefono: formData.telefono,
    ...(isDirectivo && showCodigoSection && {
      procesion: formData.procesion,
      // Enviamos solo los IDs de los turnos
      turnos: formData.turnosSeleccionados.map(t => t.uid)
    })
  };
  
  try {
    await createDevoto(data);
    
    // Resetear el formulario
    setFormData({
      nombre: "",
      apellido: "",
      DPI: "",
      email: "",
      telefono: "",
      ...(isDirectivo && {
        procesion: "",
        turnosSeleccionados: []
      })
    });
    
    if (isDirectivo) {
      setShowCodigoSection(false);
    }
    
    toast.success("Devoto registrado correctamente");
  } catch (error) {
    toast.error("Error al registrar devoto");
  }
};

  const turnosComision = turnosPorProcesion.filter(turno => turno.tipoTurno === "COMISION");

  return (
    <>
      {NavbarToShow}
      <div className="flex justify-center items-center py-10 px-4 bg-gradient-to-b from-[#f0f7fa] to-[#e0f0f5] min-h-screen">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#426A73] p-3 rounded-full text-white mr-3">
              <UserPlus size={24} />
            </div>
            <h1 className="text-3xl font-bold text-[#2B535C]">
              Registrar Devoto
            </h1>
          </div>
          <p className="text-1lx italic text-center text-[#2B535C]">
              “El amor a la Misa refleja nuestro amor por Jesucristo”<br />
              <span className="not-italic font-medium">— San Juan de la Cruz</span>
          </p>
          <br />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campos básicos del devoto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition`}
                  placeholder="Ingrese el nombre"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido*</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition`}
                  placeholder="Ingrese el apellido"
                />
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DPI*</label>
                <input
                  type="text"
                  name="DPI"
                  value={formData.DPI}
                  onChange={handleChange}
                  maxLength={13}
                  className={`mt-1 w-full border ${errors.DPI ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition`}
                  placeholder="0000 00000 0000"
                />
                {errors.DPI && <p className="text-red-500 text-xs mt-1">{errors.DPI}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition`}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength={15}
                  className={`mt-1 w-full border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition`}
                  placeholder="0000-0000"
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>

              {isDirectivo && (
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={toggleCodigoSection}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <Plus size={18} className="mr-2" />
                    {showCodigoSection ? "Ocultar Código" : "Registrar Código"}
                  </button>
                </div>
              )}
            </div>

            {/* Sección de código (procesión y turnos) solo para directivos y cuando se muestra */}
            {isDirectivo && showCodigoSection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procesión*</label>
                  <select
                    name="procesion"
                    value={formData.procesion}
                    onChange={handleChange}
                    className={`mt-1 w-full border ${errors.procesion ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#426A73] focus:border-transparent outline-none transition`}
                  >
                    <option value="">Seleccione una procesión</option>
                    {procesiones.map(p => (
                      <option key={p.uid} value={p.uid}>{p.nombre}</option>
                    ))}
                  </select>
                  {errors.procesion && <p className="text-red-500 text-xs mt-1">{errors.procesion}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Turnos*</label>
                  <button
                    type="button"
                    onClick={toggleTurnoModal}
                    disabled={!formData.procesion}
                    className={`mt-1 w-full ${!formData.procesion ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'} text-gray-800 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center`}
                  >
                    <Plus size={18} className="mr-2" />
                    {formData.turnosSeleccionados.length > 0 
                      ? `Turnos seleccionados (${formData.turnosSeleccionados.length})`
                      : "Agregar Turnos"}
                  </button>
                  {errors.turnos && <p className="text-red-500 text-xs mt-1">{errors.turnos}</p>}

                  {/* Lista de turnos seleccionados */}
                  <div className="mt-2 space-y-2">
                    {formData.turnosSeleccionados.map(turno => (
                      <div key={turno.uid} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div>
                          <p className="font-medium">Turno #{turno.noTurno}</p>
                          <p className="text-xs text-gray-600">{turno.marcha}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarTurno(turno.uid)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal para seleccionar turnos */}
            {showTurnoModal && formData.procesion && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white/90 shadow-2xl rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-200">
                  {/* Encabezado */}
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <h2 className="text-xl font-bold text-[#2B535C]">Seleccionar Turnos</h2>
                    <button 
                      onClick={toggleTurnoModal}
                      className="text-gray-500 hover:text-gray-700 transition"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Lista de turnos */}
                  <div className="space-y-3">
                    {turnosComision.length > 0 ? (
                      turnosComision.map(turno => (
                        <div 
                          key={turno.uid} 
                          className={`p-4 rounded-xl shadow-sm transition transform hover:scale-[1.02] cursor-pointer ${
                            formData.turnosSeleccionados.some(t => t.uid === turno.uid) 
                              ? 'bg-[#f0f7fa] border-2 border-[#426A73]' 
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => agregarTurno(turno)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800">Turno #{turno.noTurno}</p>
                              <p className="text-sm text-gray-600">{turno.marcha}</p>
                            </div>
                            {formData.turnosSeleccionados.some(t => t.uid === turno.uid) && (
                              <span className="text-[#426A73] text-lg">✓</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No hay turnos disponibles para esta procesión</p>
                    )}
                  </div>
                  
                  {/* Botón de cerrar */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={toggleTurnoModal}
                      className="w-full bg-gradient-to-r from-[#426A73] to-[#2B535C] hover:opacity-90 text-white py-2 rounded-lg font-medium shadow-md transition"
                    >
                      Guardar Turno
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#426A73] hover:bg-[#2B535C] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${loading ? 'opacity-75' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  "Registrar Devoto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};