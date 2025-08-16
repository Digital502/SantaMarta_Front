import React, { useEffect, useState } from "react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useFactura } from "../../shared/hooks/useFactura";
import { X, Download, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export const Factura = () => {
  const {
    facturas,
    facturaSeleccionada,
    loading,
    error,
    fetchFacturas,
    fetchFacturaById,
    editFactura,
    removeFactura,
  } = useFactura();

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 Estado para búsqueda
  const [editForm, setEditForm] = useState({
    noFactura: "",
    fechaFactura: "",
    state: true,
  });

  useEffect(() => {
    fetchFacturas();
  }, []);

  const handleVerDetalles = async (id) => {
    await fetchFacturaById(id);
    setIsEditing(false);
    setShowModal(true);
  };

  useEffect(() => {
    if (facturaSeleccionada) {
      setEditForm({
        noFactura: facturaSeleccionada.noFactura || "",
        fechaFactura: facturaSeleccionada.fechaFactura
          ? new Date(facturaSeleccionada.fechaFactura).toISOString().slice(0, 10)
          : "",
        state: facturaSeleccionada.state,
      });
    }
  }, [facturaSeleccionada]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!facturaSeleccionada) return;

    const response = await editFactura(facturaSeleccionada.uid, {
      noFactura: editForm.noFactura,
      fechaFactura: new Date(editForm.fechaFactura),
      state: editForm.state,
    });

    if (!response.error) {
      toast.success("Factura actualizada correctamente");
      fetchFacturas();
      setShowModal(false);
    } else {
      toast.error("Error al actualizar la factura");
    }

    setIsEditing(false);
  };

  const handleEliminar = async () => {
    if (!facturaSeleccionada) return;
    const confirmar = window.confirm(
      "¿Estás seguro que deseas eliminar esta factura?"
    );
    if (confirmar) {
      const response = await removeFactura(facturaSeleccionada.uid);
      if (!response.error) {
        toast.success("Factura eliminada correctamente");
        fetchFacturas();
        setShowModal(false);
      } else {
        toast.error("Error al eliminar la factura");
      }
    }
  };

  // 🔹 Filtrado de facturas según búsqueda
  const facturasFiltradas = facturas.filter((factura) => {
    const buscar = searchTerm.toLowerCase();
    const noFactura = factura.noFactura?.toString().toLowerCase() || "";
    const fechaFactura = new Date(factura.fechaFactura)
      .toLocaleDateString()
      .toLowerCase();
    const devoto = factura.devoto
      ? `${factura.devoto.nombre} ${factura.devoto.apellido}`.toLowerCase()
      : "";

    return (
      noFactura.includes(buscar) ||
      fechaFactura.includes(buscar) ||
      devoto.includes(buscar)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAdmin />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lista de Facturas
        </h1>
        <br />
        {/* 🔹 Barra de búsqueda */}
        <div className="flex items-center mb-6 gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por #Factura, Fecha o Devoto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#426A73] outline-none"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando facturas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : facturasFiltradas.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay facturas que coincidan con la búsqueda.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-[#426A73] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">#Factura</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Devoto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Turno</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{factura.noFactura}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(factura.fechaFactura).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {factura.devoto
                        ? `${factura.devoto.nombre} ${factura.devoto.apellido}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {factura.turno ? factura.turno.noTurno : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleVerDetalles(factura.uid)}
                        className="rounded bg-[#426A73] px-4 py-1 text-white hover:bg-[#2B535C] transition"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Modal Detalles */}
        {showModal && facturaSeleccionada && (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 bg-opacity-50 backdrop-blur-sm py-10 overflow-y-auto"
            onClick={() => {
            setShowModal(false);
            setIsEditing(false);
            }}
        >
            <div
            className="bg-white rounded-xl w-full max-w-2xl mx-4 my-8 p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            >
            <button
                className="absolute top-4 right-4 text-gray-500 hover:text-[#426A73] transition-colors"
                onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                }}
                aria-label="Cerrar modal"
            >
                <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-[#426A73] mb-6 border-b pb-3">
                {isEditing ? "Editar Factura" : "Detalles de la Factura"}
            </h2>

            <div className="max-h-[70vh] overflow-y-auto pr-2">
                {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Factura
                        </label>
                        <input
                        type="text"
                        name="noFactura"
                        value={editForm.noFactura}
                        onChange={handleEditChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Factura
                        </label>
                        <input
                        type="date"
                        name="fechaFactura"
                        value={editForm.fechaFactura}
                        onChange={handleEditChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-transparent"
                        />
                    </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        name="state"
                        id="state"
                        checked={editForm.state}
                        onChange={handleEditChange}
                        className="rounded text-[#426A73] focus:ring-[#426A73]"
                    />
                    <label htmlFor="state" className="text-sm text-gray-700">
                        Activa
                    </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#426A73] text-white hover:bg-[#2B535C] transition-colors"
                    >
                        Guardar Cambios
                    </button>
                    </div>
                </form>
                ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Número de Factura</p>
                        <p className="font-medium">{facturaSeleccionada.noFactura}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Fecha de Factura</p>
                        <p className="font-medium">
                        {new Date(facturaSeleccionada.fechaFactura).toLocaleDateString()}
                        </p>
                    </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#426A73] mb-3">Datos del Devoto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-medium">
                            {facturaSeleccionada.devoto?.nombre || "N/A"} {facturaSeleccionada.devoto?.apellido || ""}
                        </p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">DPI</p>
                        <p className="font-medium">{facturaSeleccionada.devoto?.DPI || "N/A"}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{facturaSeleccionada.devoto?.email || "N/A"}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium">{facturaSeleccionada.devoto?.telefono || "N/A"}</p>
                        </div>
                        <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Contraseña</p>
                        <p className="font-medium">
                            {facturaSeleccionada.contraseñaAsociada || "No asignada"}
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#426A73] mb-3">Datos del Turno</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                        <p className="text-sm text-gray-500">Número de Turno</p>
                        <p className="font-medium">{facturaSeleccionada.turno?.noTurno || "N/A"}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Marcha</p>
                        <p className="font-medium">{facturaSeleccionada.turno?.marcha || "N/A"}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="font-medium">
                            {facturaSeleccionada.turno?.precio ? `Q${facturaSeleccionada.turno.precio}` : "N/A"}
                        </p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Procesión</p>
                        <p className="font-medium">
                            {facturaSeleccionada.turno?.procesion?.nombre || "N/A"}
                        </p>
                        </div>
                        <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Fecha Procesión</p>
                        <p className="font-medium">
                            {facturaSeleccionada.turno?.procesion?.fecha
                            ? new Date(facturaSeleccionada.turno.procesion.fecha).toLocaleDateString()
                            : "N/A"}
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#426A73] mb-3">Datos del Usuario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                        <p className="text-sm text-gray-500">Registrado por</p>
                        <p className="font-medium">{facturaSeleccionada.usuario?.nombre || "N/A"}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{facturaSeleccionada.usuario?.email || "N/A"}</p>
                        </div>
                    </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#426A73] text-white hover:bg-[#2B535C] transition-colors"
                    >
                        <Download size={18} />
                        Descargar Factura
                    </button>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#426A73] text-white hover:bg-[#2B535C] transition-colors"
                    >
                        <Edit size={18} />
                        Editar
                    </button>

                    <button
                        onClick={handleEliminar}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={18} />
                        Eliminar
                    </button>
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
        )}
      </main>
      <Footer />
    </div>
  );
};