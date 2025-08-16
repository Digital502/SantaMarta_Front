import React, { useState } from "react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { PlusCircle, Trash2, Calendar, User, List, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/bannerMarcheros.svg";

export const Procesion = () => {
  const {
    procesiones,
    createProcesion,
    removeProcesion,
    editProcesion,
    loading,
  } = useProcesion();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [procesionEditId, setProcesionEditId] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    totalTurnos: "",
    fecha: "",
  });

  // solo usamos fecha para editar
  const [fechaEdit, setFechaEdit] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProcesion(formulario);
    setFormulario({
      nombre: "",
      descripcion: "",
      totalTurnos: "",
      fecha: "",
    });
    setShowModal(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await editProcesion(procesionEditId, { fecha: fechaEdit });
    setShowEditModal(false);
    setProcesionEditId(null);
    setFechaEdit("");
  };

  const openEditModal = (id, fecha) => {
    setProcesionEditId(id);
    setFechaEdit(fecha.slice(0, 10));  // formato yyyy-mm-dd
    setShowEditModal(true);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      <NavbarAdmin />

      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
        <img
          src={banner}
          alt="Procesiones"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A]/65 to-[#0D1B2A]/65 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              Marcheros
            </h1>
            <p className="text-2sm italic text-[#fff] mb-2 max-w-lg">
              “Hay más beneficio en la Eucaristía que en una semana de ayuno de pan y agua”.
              <span className="not-italic">— San Vicente Ferrer</span>
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2B535C]">Listado de Marcheros</h2>
            <p className="text-gray-600">
              {procesiones.length} {procesiones.length === 1 ? "marchero registrado" : "marcheros registrados"}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#426A73] hover:bg-[#2B535C] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <PlusCircle size={20} />
            Agregar Marchero
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#426A73]"></div>
          </div>
        ) : procesiones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hay marcheros registrados</h3>
            <p className="text-gray-500 mb-4">Comienza agregando un nuevo marchero</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#426A73] hover:bg-[#2B535C] text-white rounded-lg transition"
            >
              <PlusCircle size={18} />
              Agregar primer marchero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {procesiones.map((p) => (
              <div
                key={p.uid}
                className="bg-[#E0E1DD] border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-[#426A73]/30"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => navigate(`/directiva/marcheros/${p.uid}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-[#2B535C]">{p.nombre}</h3>
                  </div>

                  {p.descripcion && (
                    <p className="text-gray-600 mb-4 text-sm">{p.descripcion}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <List size={16} className="text-[#426A73]" />
                      <span>Turnos: <span className="font-medium text-gray-700">{p.totalTurnos}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={16} className="text-[#426A73]" />
                      <span>Fecha: {new Date(p.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#E0E1DD] px-6 py-3 flex justify-between">
                  <button
                    onClick={() => openEditModal(p.uid, p.fecha)}
                    className="text-sm text-[#426A73] hover:text-[#2B535C] font-medium flex items-center gap-1 transition"
                  >
                    <Pencil size={14} />
                    Editar fecha
                  </button>

                  <button
                    onClick={() => removeProcesion(p.uid)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition"
                  >
                    <Trash2 size={14} />
                    Eliminar marchero
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative animate-slideUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-center text-[#2B535C] mb-1">Nuevo Marchero</h3>
              <p className="text-center text-gray-500 text-sm">Completa los datos del marchero</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Jesús Nazareno - Quinto Domingo"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ej: Marchero principal de la procesión"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="totalTurnos" className="block text-sm font-medium text-gray-700 mb-1">
                    Turnos asignados
                  </label>
                  <input
                    type="number"
                    id="totalTurnos"
                    name="totalTurnos"
                    placeholder="Ej: 3"
                    value={formulario.totalTurnos}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#426A73] hover:bg-[#2B535C] text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  Guardar marchero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl relative animate-slideUp">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-center text-[#2B535C] mb-4">Editar fecha</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="fechaEdit" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva fecha
                </label>
                <input
                  type="date"
                  id="fechaEdit"
                  name="fechaEdit"
                  value={fechaEdit}
                  onChange={(e) => setFechaEdit(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#426A73] hover:bg-[#2B535C] text-white py-3 rounded-lg font-medium transition"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
