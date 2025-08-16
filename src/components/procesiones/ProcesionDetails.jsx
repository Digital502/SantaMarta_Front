import React, { useEffect, useState } from 'react';
import { NavbarAdmin } from '../navs/NavbarAdmin';
import { Footer } from '../footer/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useProcesion } from '../../shared/hooks/useProcesion';
import { useTurno } from '../../shared/hooks/useTurno';
import { Calendar, List, ChevronLeft, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { LoadingSpinner } from '../loadinSpinner/LoadingSpinner';

export const ProcesionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { procesion, fetchProcesionById, loading } = useProcesion();
  const {
    turnosPorProcesion,
    createTurno,
    editTurno,
    removeTurno,
    fetchTurnosByProcesion,
    downloadInventario
  } = useTurno();

  const [showModal, setShowModal] = useState(false);
  const [editingTurnoId, setEditingTurnoId] = useState(null);

  const [formData, setFormData] = useState({
    noTurno: '',
    direccion: '',
    marcha: '',
    cantidad: 0,
    precio: 0,
    tipoTurno: 'ORDINARIO',
  });

  useEffect(() => {
    if (id) {
      fetchProcesionById(id);
      fetchTurnosByProcesion(id);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTurnoId) {
      await editTurno(editingTurnoId, { ...formData, procesion: id });
    } else {
      await createTurno({ ...formData, procesion: id });
    }
    await fetchTurnosByProcesion(id);
    setShowModal(false);
    setEditingTurnoId(null);
    setFormData({
      noTurno: '',
      direccion: '',
      marcha: '',
      cantidad: 0,
      precio: 0,
      tipoTurno: 'ORDINARIO',
    });
  };

  const handleEdit = (turno) => {
    setFormData({
      noTurno: turno.noTurno,
      direccion: turno.direccion,
      marcha: turno.marcha,
      cantidad: turno.cantidad,
      cantidadSinVender: turno.cantidadSinVender,
      cantidadVendida: turno.cantidadVendida,
      precio: turno.precio,
      tipoTurno: turno.tipoTurno,
    });
    setEditingTurnoId(turno.uid);
    setShowModal(true);
  };

  const handleDelete = async (turnoId) => {
    await removeTurno(turnoId, id);
    await fetchTurnosByProcesion(id);
  };

  const handleDownload = async (id) => {
   await downloadInventario(id);
  }

  if (loading) return <LoadingSpinner />;

  if (!procesion) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-gray-600">No se encontró la procesión</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      <NavbarAdmin />

      {/* Encabezado */}
      <div className="bg-gradient-to-r from-[#426A73] to-[#2B535C] py-10 text-white text-center shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{procesion.nombre}</h1>
        <p className="text-sm md:text-base italic text-[#E0E1DD]">
          "La Eucaristía es el tesoro más grande de la Iglesia."
          <span className="not-italic">— San Juan Pablo II</span>
        </p>
      </div>

      <main className="container mx-auto px-4 py-10">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/directiva/marcheros')}
          className="flex items-center gap-2 text-[#426A73] hover:text-[#2B535C] transition mb-8"
        >
          <ChevronLeft size={20} />
          Volver al listado
        </button>

        {/* Info procesión */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          {procesion.descripcion && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#2B535C] mb-1">Descripción</h2>
              <p className="text-gray-700">{procesion.descripcion}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#E0E1DD] p-3 rounded-lg text-[#426A73]">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
                <p className="text-lg font-medium">
                  {new Date(procesion.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#E0E1DD] p-3 rounded-lg text-[#426A73]">
                <List size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Turnos asignados</h3>
                <p className="text-lg font-medium">{procesion.totalTurnos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Turnos */}
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#2B535C]">Turnos</h2>
        <div className="flex gap-3">
            <button
            onClick={() => {
                setEditingTurnoId(null);
                setFormData({
                noTurno: '',
                direccion: '',
                marcha: '',
                cantidad: 0,
                cantidadSinVender: 0,
                cantidadVendida: 0,
                precio: 0,
                tipoTurno: 'ORDINARIO',
                });
                setShowModal(true);
            }}
            className="bg-[#426A73] text-white px-4 py-2 rounded hover:bg-[#2B535C] flex items-center gap-2 shadow-md transition"
            >
            <Plus size={18} /> Agregar Turno
            </button>
            
            <button
            onClick={() => handleDownload(id)}
            className="bg-[#426A73] text-white px-4 py-2 rounded hover:bg-[#2B535C] flex items-center gap-2 shadow-md transition"
            >
            <Download size={18}/>
            Descargar PDF
            </button>
        </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">#</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Dirección</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Marcha</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cantidad</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cantidad Disponible</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cantidad Vendida</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Precio</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {turnosPorProcesion.map((turno) => (
                <tr key={turno.uid}>
                  <td className="px-4 py-2 whitespace-nowrap">{turno.noTurno}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{turno.direccion}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{turno.marcha}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{turno.cantidad}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{turno.cantidadSinVender}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{turno.cantidadVendida}</td>
                  <td className="px-4 py-2 whitespace-nowrap">Q.{turno.precio}</td>
                  <td className="px-4 py-2 whitespace-nowrap flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(turno)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(turno.uid)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-xl relative animate-slideUp max-h-[85vh] overflow-y-auto">
              {/* Cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>

              {/* Título */}
              <div className="mb-5">
                <h3 className="text-xl font-bold text-center text-[#2B535C]">
                  {editingTurnoId ? 'Editar Turno' : 'Agregar Turno'}
                </h3>
                <p className="text-center text-gray-500 text-sm mt-1">
                  {editingTurnoId
                    ? 'Modifica los datos del turno'
                    : 'Completa los datos del nuevo turno'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Turno</label>
                  <input
                    type="text"
                    name="noTurno"
                    value={formData.noTurno}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marcha</label>
                  <input
                    type="text"
                    name="marcha"
                    value={formData.marcha}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                    <input
                      type="number"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                    />
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Disponible</label>
                    <input
                      type="number"
                      name="cantidadSinVender"
                      value={formData.cantidadSinVender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Vendida</label>
                    <input
                      type="number"
                      name="cantidadVendida"
                      value={formData.cantidadVendida}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Turno</label>
                  <select
                    name="tipoTurno"
                    value={formData.tipoTurno}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#426A73]"
                  >
                    <option value="ORDINARIO">Ordinario</option>
                    <option value="COMISION">Comisión</option>
                  </select>
                </div>

                {/* Botón */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-[#426A73] hover:bg-[#2B535C] text-white py-2.5 rounded-lg font-medium transition"
                  >
                    {editingTurnoId ? 'Actualizar Turno' : 'Guardar Turno'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
