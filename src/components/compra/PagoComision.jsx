import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { usePagoComision } from "../../shared/hooks/usePagoComision";
import { useCompra } from "../../shared/hooks/useCompra";
import { CreditCard } from "lucide-react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { NavbarUser } from "../navs/NavbarUser";

export const PagoComision = () => {
  const { devotos, fetchDevotoById, devoto, loading } = useDevoto();
  const { pagarComision, loading: loadingPago } = usePagoComision();
  const { verFactura } = useCompra();
  const user = JSON.parse(localStorage.getItem("user"));
  const NavbarToShow = user?.role === "ROL_DIRECTIVO" ? <NavbarAdmin /> : <NavbarUser />;

  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [devotoSeleccionado, setDevotoSeleccionado] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("");
  const [montoPago, setMontoPago] = useState("");

  // Filtrar devotos según búsqueda
  useEffect(() => {
    if (!busqueda.trim()) return setSugerencias([]);
    const term = busqueda.toLowerCase();

    const filtrados = devotos
      .map((d) => {
        const turno = d.turnos?.find((t) => t.turno);
        const nombre = d.nombre?.toLowerCase() || "";
        const apellido = d.apellido?.toLowerCase() || "";
        const dpi = d.DPI?.toLowerCase() || "";
        const nombreCompleto = `${nombre} ${apellido}`.trim();
        const coincide =
          nombre.includes(term) ||
          apellido.includes(term) ||
          nombreCompleto.includes(term) ||
          dpi.includes(term);

        return coincide ? d : null;
      })
      .filter(Boolean)
      .filter((d, i, arr) => arr.findIndex(x => x._id === d._id) === i);

    setSugerencias(filtrados);
  }, [busqueda, devotos]);

  // Cargar datos del devoto seleccionado
  useEffect(() => {
    if (devotoSeleccionado) {
      fetchDevotoById(devotoSeleccionado);
      setTurnoSeleccionado("");
      setMontoPago("");
    }
  }, [devotoSeleccionado]);

  // Resetear monto al cambiar de turno
  useEffect(() => {
    setMontoPago("");
  }, [turnoSeleccionado]);

  const handlePagar = async () => {
    if (!montoPago || !turnoSeleccionado || !devotoSeleccionado) {
      return toast.error("Seleccione devoto, turno e ingrese un monto");
    }

    try {
      const response = await pagarComision({
        devotoId: devotoSeleccionado,
        turnoId: turnoSeleccionado,
        montoPagado: Number(montoPago),
      });
      
      await fetchDevotoById(devotoSeleccionado);
      setMontoPago("");
      setTurnoSeleccionado("");
      toast.success("Pago registrado exitosamente");

      if (response?.noFactura) {
        verFactura(response.noFactura);
      } else {
        toast.error("No se pudo obtener la factura del pago");
      }
    } catch (error) {
      toast.error("Ocurrió un error al registrar el pago");
    }
  };

  const turnosFiltrados = devoto?.turnos
    ?.filter(t => t.turno && t.turno.tipoTurno === "COMISION") || [];

  const turnoDevotoSeleccionado = devoto
    ? devoto.turnos.find(t => {
        if (!t.turno) return false;
        const idTurno = t.turno.uid || t.turno._id?.toString();
        return idTurno === turnoSeleccionado;
      })
    : null;

  const precioTotal = turnoDevotoSeleccionado?.turno?.precio || 0;
  const montoPagado1 = turnoDevotoSeleccionado?.montoPagado || 0;
  const saldoPendiente = precioTotal - montoPagado1;
  const estadoPago = turnoDevotoSeleccionado?.estadoPago || "PENDIENTE";
  const contraseñas = turnoDevotoSeleccionado?.contraseñas || "Sin info";

  return (
    <div>
      {NavbarToShow}
    <div className="max-w-4xl mx-auto p-6">
      {/* Encabezado con estilo */}
      <div className="bg-[#142130] text-white rounded-t-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Pago de Comisión
        </h1>
        <p className="opacity-90 mt-1">Complete los datos requeridos para registrar una compra</p>
        
        <div className="mt-4 italic text-sm opacity-80 flex items-center gap-2">
          <span>"Una sola Misa escuchada durante la vida es más valiosa que muchos bienes materiales dejados en herencia"</span>
        </div>
        <p className="text-xs opacity-70 text-right">— San Juan Bosco</p>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-b-xl shadow-md divide-y divide-gray-200">
        {/* Sección de búsqueda */}
        <div className="p-6">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#142130]-600 focus:border-transparent transition-all"
              placeholder="Buscar devoto por nombre, apellido o DPI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="absolute left-4 top-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sugerencias con animación */}
          {sugerencias.length > 0 && (
            <ul className="mt-2 border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
              {sugerencias.map((d, index) => (
                <li
                  key={`${d._id}-${index}`}
                  className="p-3 hover:bg-purple-50 cursor-pointer transition-colors duration-200"
                  onClick={() => setDevotoSeleccionado(d._id)}
                >
                  <div className="flex items-center">
                    <div className="bg-[#142130]-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#142130]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{d.nombre} {d.apellido}</p>
                      <p className="text-sm text-gray-500">DPI: {d.DPI || 'No registrado'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Información del devoto */}
        {devoto && (
          <div className="p-6 bg-gray-50">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Información del Devoto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-medium">{devoto.nombre} {devoto.apellido}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documento (DPI)</p>
                    <p className="font-medium">{devoto.DPI || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{devoto.telefono || 'No registrado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selección de turno */}
        {devotoSeleccionado && loading && (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {turnosFiltrados.length > 0 && (
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione un turno</label>
            <select
              className="w-full p-3 border border-[#142130]-300 rounded-lg focus:ring-2 focus:ring-[#142130]-600 focus:border-transparent transition-all"
              value={turnoSeleccionado}
              onChange={(e) => setTurnoSeleccionado(e.target.value)}
            >
              <option value=""> Seleccione un turno </option>
              {turnosFiltrados.map(t => (
                <option
                  key={t.turno.uid || t.turno._id}
                  value={t.turno.uid || t.turno._id}
                >
                  {t.turno.noTurno} - {t.turno.procesion?.nombre || "Procesión no especificada"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Información del turno */}
        {turnoSeleccionado && turnoDevotoSeleccionado && (
          <div className="p-6 bg-blue-50 rounded-lg m-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Detalles del Turno
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Número de turno</p>
                  <p className="font-medium">{turnoDevotoSeleccionado.turno.noTurno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de turno</p>
                  <p className="font-medium">{turnoDevotoSeleccionado.turno.tipoTurno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Procesión</p>
                  <p className="font-medium">{turnoDevotoSeleccionado.turno.procesion?.nombre || "Sin información"}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Estado de pago</p>
                  <p className={`font-medium ${
                    estadoPago === "PAGADO" ? "text-green-600" : 
                    estadoPago === "PENDIENTE" ? "text-yellow-600" : 
                    "text-gray-600"
                  }`}>
                    {estadoPago}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio total</p>
                  <p className="font-medium text-lg">Q{precioTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saldo pendiente</p>
                  <p className={`font-medium text-lg ${
                    saldoPendiente > 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    Q{saldoPendiente.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contraseña</p>
                  <p className="font-mono font-medium bg-gray-100 px-2 py-1 rounded inline-block">
                    {contraseñas}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monto de pago */}
        {turnoSeleccionado && (
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Monto a pagar (Q)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">Q</span>
              <input
                type="number"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142130]-600 focus:border-transparent transition-all"
                value={montoPago}
                onChange={(e) => setMontoPago(e.target.value)}
                placeholder="0.00"
                min="0"
                max={saldoPendiente}
                step="0.01"
              />
            </div>
            {montoPago > saldoPendiente && (
              <p className="mt-2 text-sm text-red-600">El monto no puede exceder el saldo pendiente</p>
            )}
          </div>
        )}

        {/* Botón de pago */}
        {turnoSeleccionado && (
          <div className="p-6 pt-0">
            <button
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                loadingPago ? 'bg-[#142130]' : 'bg-[#142130] hover:bg-purple-[#142130] shadow-md hover:shadow-lg'
              } flex items-center justify-center`}
              onClick={handlePagar}
              disabled={loadingPago || !montoPago || montoPago <= 0 || montoPago > saldoPendiente}
            >
              {loadingPago ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando pago...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Registrar Pago
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};