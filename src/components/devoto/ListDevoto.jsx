import React, { useState } from "react";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { Edit, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Footer } from "../footer/Footer";
import { NavbarAdmin } from "../navs/NavbarAdmin";

export const ListDevoto = () => {
  const { devotos, loading, removeDevoto, fetchDevotoById, editDevoto } = useDevoto();

  const [selectedDevoto, setSelectedDevoto] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    DPI: "",
    email: "",
    telefono: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const handleViewDetails = async (id) => {
    const response = await fetchDevotoById(id);
    if (response && !response.error) {
      setSelectedDevoto(response.devoto);
      setEditForm({
        nombre: response.devoto.nombre,
        apellido: response.devoto.apellido,
        DPI: response.devoto.DPI,
        email: response.devoto.email,
        telefono: response.devoto.telefono,
      });
      setShowDetailsModal(true);
    } else {
      toast.error("No se pudo cargar el devoto");
    }
  };

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      await removeDevoto(id);
      setDeleteConfirm(null);
      setShowDetailsModal(false);
      toast.success("Devoto eliminado correctamente");
    } else {
      setDeleteConfirm(id);
      toast("Presiona de nuevo para confirmar eliminación", { icon: "⚠️" });
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await editDevoto(selectedDevoto._id, editForm);
    setIsEditing(false);
    setShowDetailsModal(false);
    toast.success("Devoto actualizado correctamente");
  };

  const filteredDevotos = devotos.filter((d) => {
    const term = searchTerm.toLowerCase();

    const matchSearch =
      d.nombre.toLowerCase().includes(term) ||
      d.apellido.toLowerCase().includes(term) ||
      d.DPI.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term);
    if (!filtroEstado) return matchSearch;
    const tieneEstado = d.turnos?.some(t => t.estadoPago === filtroEstado);
    return matchSearch && tieneEstado;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarAdmin />

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Listado de Devotos</h1>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, DPI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 rounded-md border border-gray-300 px-4 py-2 text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-[#426A73] transition"
            aria-label="Buscar devoto"
          />
          <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full md:w-40 rounded-md border border-gray-300 px-3 py-2 text-gray-700
                        focus:outline-none focus:ring-2 focus:ring-[#426A73] transition"
            >
              <option value="">Todos</option>
              <option value="PAGADO">Pagado</option>
              <option value="MITAD">Mitad</option>
              <option value="NO_PAGADO">No pagado</option>
          </select>
        </div>

        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#426A73] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Apellido</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">DPI</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Cargando devotos...
                  </td>
                </tr>
              ) : filteredDevotos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No se encontraron devotos.
                  </td>
                </tr>
              ) : (
                filteredDevotos.map((devoto) => (
                  <tr
                    key={devoto._id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleViewDetails(devoto._id)}
                    title="Ver detalles"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{devoto.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{devoto.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{devoto.DPI}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{devoto.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDevoto(devoto);
                          setEditForm({
                            nombre: devoto.nombre,
                            apellido: devoto.apellido,
                            DPI: devoto.DPI,
                            email: devoto.email,
                            telefono: devoto.telefono,
                          });
                          setIsEditing(true);
                          setShowDetailsModal(true);
                        }}
                        className="text-[#426A73] hover:text-[#2B535C] transition"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(devoto._id);
                        }}
                        className={`transition ${
                          deleteConfirm === devoto._id
                            ? "text-white bg-red-600 hover:bg-red-700 rounded px-2"
                            : "text-red-600 hover:bg-red-50 rounded px-2"
                        }`}
                        title={deleteConfirm === devoto._id ? "Confirmar eliminación" : "Eliminar"}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showDetailsModal && (
  <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 sm:p-6"
    style={{
      background: "radial-gradient(circle at center, rgba(66, 106, 115, 0.15), transparent 70%)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}
    onClick={() => {
      setShowDetailsModal(false);
      setIsEditing(false);
      setSelectedDevoto(null);
    }}
  >
    <div 
      className="bg-white bg-opacity-95 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeInScale"
      style={{ animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Encabezado */}
      <header className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sm:px-8 sm:py-5 sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm z-20 rounded-t-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#426A73] tracking-wide">
            {isEditing ? "Editar Devoto" : "Detalles del Devoto"}
          </h2>
        </div>
        <button
          onClick={() => {
            setShowDetailsModal(false);
            setIsEditing(false);
            setSelectedDevoto(null);
          }}
          className="text-gray-500 hover:text-[#426A73] transition-transform hover:scale-110 p-1"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>
      </header>

      {/* Contenido Principal */}
      <section className="px-6 py-4 sm:px-8 sm:py-6 space-y-6">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Nombre", name: "nombre", type: "text" },
                { label: "Apellido", name: "apellido", type: "text" },
                { label: "DPI", name: "DPI", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Teléfono", name: "telefono", type: "tel" },
              ].map(({ label, name, type }) => (
                <div key={name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}*
                  </label>
                  <input
                    type={type}
                    required
                    value={editForm[name]}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [name]: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#426A73]
                             focus:border-transparent transition text-base"
                    placeholder={`Ingrese ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium
                         hover:bg-gray-50 transition text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#426A73] text-white font-semibold
                         hover:bg-[#2B535C] transition text-base flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem 
                label="Nombre Completo" 
                value={`${selectedDevoto.nombre} ${selectedDevoto.apellido}`} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#426A73]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                }
              />
              <DetailItem 
                label="DPI" 
                value={selectedDevoto.DPI} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#426A73]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                }
              />
              <DetailItem 
                label="Email" 
                value={selectedDevoto.email} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#426A73]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
              <DetailItem 
                label="Teléfono" 
                value={selectedDevoto.telefono} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#426A73]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                }
              />
            </div>

            {/* Sección de Turnos y Contraseñas */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-[#426A73] mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Turnos Asignados
              </h3>

              {selectedDevoto.turnos?.length > 0 ? (
                <div className="space-y-4">
                  {selectedDevoto.turnos.map((turno, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Información del Turno */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#426A73] text-white text-sm font-bold px-2.5 py-1 rounded-full">
                              #{turno.noTurno}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {turno.marcha}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Estado de Pago: {turno.estadoPago || 'No especificado'}
                          </p>
                        </div>

                        {/* Información de la Procesión */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-500">Procesión</h4>
                          <p className="font-semibold text-gray-800">{turno.procesionNombre}</p>
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-500">Contraseña</h4>
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <p className="font-mono font-semibold text-[#426A73] truncate">
                              {turno.contraseñas}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(turno.contraseñas);
                                toast.success('Contraseña copiada al portapapeles');
                              }}
                              className="text-gray-400 hover:text-[#426A73] transition p-1 rounded-full hover:bg-gray-100"
                              title="Copiar contraseña"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="mt-3 text-gray-500 font-medium">No hay turnos asignados</h4>
                  <p className="text-sm text-gray-400 mt-1">Este devoto no tiene turnos registrados</p>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleDelete(selectedDevoto._id)}
                className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium transition
                  ${deleteConfirm === selectedDevoto._id
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-red-600 text-red-600 hover:bg-red-50"
                  }`}
              >
                <Trash2 size={18} />
                {deleteConfirm === selectedDevoto._id ? "Confirmar Eliminación" : "Eliminar Devoto"}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#426A73] px-5 py-2.5 font-medium text-white hover:bg-[#2B535C] transition"
              >
                <Edit size={18} />
                Editar Información
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  </div>
)}

      <Footer />
    </div>
  );
};

const DetailItem = ({ label, value, icon = null }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    {icon && (
      <div className="flex-shrink-0 mt-0.5">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </h3>
      <p className="mt-1 text-sm font-semibold text-gray-800 break-words">
        {value || (
          <span className="text-gray-400 italic">No especificado</span>
        )}
      </p>
    </div>
  </div>
);