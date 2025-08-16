import React, { useState, useMemo } from 'react';
import { NavbarAdmin } from '../navs/NavbarAdmin';
import { Footer } from '../footer/Footer';
import { useUsers } from '../../shared/hooks/useUsers';
import { useHistorialVenta } from '../../shared/hooks/useHistorialVenta';
import { RefreshCw } from 'lucide-react';

export const HistorialVenta = () => {
  const { users, isFetching: loadingUsers } = useUsers();
  
  const [usuarioId, setUsuarioId] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  const { historial, loading: loadingHistorial, error: errorHistorial, fetchHistorial } = useHistorialVenta(usuarioId);

  // Función segura para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

const historialFiltrado = useMemo(() => {
  if (!fechaFiltro) return historial;

  return historial.filter((venta) => {
    if (!venta.fechaFactura) return false;

    // Comparar solo la fecha en formato YYYY-MM-DD
    const ventaFechaStr = new Date(venta.fechaFactura)
      .toISOString()
      .split('T')[0];

    return ventaFechaStr === fechaFiltro;
  });
}, [historial, fechaFiltro]);

  // Total vendido en la fecha filtrada
  const totalVendido = useMemo(() => {
    return historialFiltrado.reduce((total, venta) => total + (venta.precio || 0), 0);
  }, [historialFiltrado]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Ventas</h1>
            <p className="text-gray-600">Visualiza el historial de ventas por usuario</p>
          </header>

          {/* Selector de usuario */}
          <div className="mb-6">
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Usuario
            </label>
            <select
              id="usuario"
              className="w-full md:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-[#426A73]"
              value={usuarioId}
              onChange={(e) => {
                setUsuarioId(e.target.value);
                setFechaFiltro('');
              }}
              disabled={loadingUsers}
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.nombre} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Selector de fecha */}
          <div className="mb-6 md:w-1/3">
            <label htmlFor="fechaFiltro" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por fecha
            </label>
            <input
              type="date"
              id="fechaFiltro"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#426A73] focus:border-[#426A73]"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              disabled={!usuarioId}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Botón de recarga */}
          {usuarioId && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={fetchHistorial}
                disabled={loadingHistorial}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#426A73] hover:bg-[#2B535C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#426A73] disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loadingHistorial ? 'animate-spin' : ''}`} />
                Recargar Historial
              </button>
            </div>
          )}

          {/* Mensajes de estado */}
          {loadingHistorial && (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando historial de ventas...</p>
            </div>
          )}

          {errorHistorial && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorHistorial}</p>
                </div>
              </div>
            </div>
          )}

          {/* Total vendido en la fecha */}
          {fechaFiltro && historialFiltrado.length > 0 && (
            <div className="mb-4 text-right text-lg font-semibold text-gray-700">
              Total vendido en {fechaFiltro}: Q{totalVendido.toFixed(2)}
            </div>
          )}

          {/* Tabla de historial filtrado */}
          {!loadingHistorial && usuarioId && historialFiltrado.length > 0 && (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devoto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historialFiltrado.map((venta) => (
                    <tr key={venta.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.noFactura}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(venta.fechaFactura)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.devoto || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.turno || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Q{(venta.precio || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mensaje cuando no hay resultados */}
          {!loadingHistorial && usuarioId && historialFiltrado.length === 0 && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">No hay ventas registradas</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>El usuario seleccionado no tiene ventas registradas en esa fecha.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
