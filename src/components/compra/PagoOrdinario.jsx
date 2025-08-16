import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Search, User, CreditCard, CalendarCheck, ChevronDown } from "lucide-react";
import { useDevoto } from "../../shared/hooks/useDevoto";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { useTurno } from "../../shared/hooks/useTurno";
import { usePagoOrdinario } from "../../shared/hooks/usePagoOrdinario";
import { useCompra } from "../../shared/hooks/useCompra";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { NavbarUser } from "../navs/NavbarUser";

export const PagoOrdinario = () => {
  const { devotos, fetchDevotoById, devoto } = useDevoto();
  const { procesiones } = useProcesion();
  const { fetchTurnosByProcesion } = useTurno();
  const { pagar: pagarOrdinario, loading: loadingPago } = usePagoOrdinario();
  const { verFactura } = useCompra();
  const user = JSON.parse(localStorage.getItem("user"));
  const NavbarToShow = user?.role === "ROL_DIRECTIVO" ? <NavbarAdmin /> : <NavbarUser />;

  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [contraseñasDisponibles, setContraseñasDisponibles] = useState([]);
  const [contraseñaSeleccionada, setContraseñaSeleccionada] = useState("");
  const [procesionFiltrada, setProcesionFiltrada] = useState(null);
  const [turnosProcesion, setTurnosProcesion] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  // Buscar devotos
  useEffect(() => {
    if (!busqueda.trim()) return setSugerencias([]);
    const term = busqueda.toLowerCase();

    const filtrados = devotos
      .map((d) => {
        const nombre = d.nombre?.toLowerCase() || "";
        const apellido = d.apellido?.toLowerCase() || "";
        const nombreCompleto = `${nombre} ${apellido}`.trim();
        const dpi = d.DPI?.toLowerCase() || "";

        const coincide =
          nombre.includes(term) ||
          apellido.includes(term) ||
          nombreCompleto.includes(term) ||
          dpi.includes(term);

        return coincide ? d : null;
      })
      .filter(Boolean);

    setSugerencias(filtrados);
  }, [busqueda, devotos]);

  // Seleccionar devoto
  const seleccionarDevoto = async (devotoBase) => {
    try {
      await fetchDevotoById(devotoBase._id);

      // Filtrar solo turnos ordinarios con contraseña
      const turnosOR = devotoBase.turnos?.filter(t => 
      t && (t.contraseñas || t.contraseña) && /^OR[A-Za-z0-9]+$/.test(t.contraseñas || t.contraseña)
    ) || [];

      if (!turnosOR.length) {
        toast.error("El devoto seleccionado no tiene turnos ordinarios");
        setContraseñasDisponibles([]);
        setContraseñaSeleccionada("");
        setProcesionFiltrada(null);
        setTurnosProcesion([]);
        return;
      }

      // Obtener contraseñas únicas
      const contraseñas = turnosOR
      .map(t => (t.contraseñas || t.contraseña).trim())
      .filter((c, i, arr) => c && arr.indexOf(c) === i); 
      setContraseñasDisponibles(contraseñas);

      // Resetear selección
      setContraseñaSeleccionada("");
      setProcesionFiltrada(null);
      setTurnosProcesion([]);
      setTurnoSeleccionado(null);

    } catch (error) {
      toast.error("Ocurrió un error al seleccionar devoto");
    }
  };
  // Seleccionar contraseña
  const seleccionarContraseña = async (contraseña) => {
    setContraseñaSeleccionada(contraseña);

    // Buscar procesión
    const match = contraseña.match(/^OR([A-Z]+)/);
    const inicialesProcesion = match ? match[1] : "";

    const procesionCoincidente = procesiones.find((p) => {
      if (!p.nombre) return false;
      const iniciales = p.nombre
        .split(" ")
        .filter(word => word.length > 0)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
      return iniciales === inicialesProcesion;
    });

    if (!procesionCoincidente) {
      toast.error(`No se encontró procesión con iniciales ${inicialesProcesion}`);
      setProcesionFiltrada(null);
      setTurnosProcesion([]);
      return;
    }

    setProcesionFiltrada(procesionCoincidente);

    // Traer turnos de la procesión
    const turnosResponse = await fetchTurnosByProcesion(
      procesionCoincidente.uid || procesionCoincidente._id
    );
    const turnosArray = turnosResponse?.turnos || turnosResponse || [];
    setTurnosProcesion(turnosArray.map((t) => ({ ...t, _id: t._id || t.uid })));
  };

  // Registrar pago
  const handlePagar = async () => {
    if (!devoto || !turnoSeleccionado || !contraseñaSeleccionada) {
      toast.error("Seleccione un devoto, contraseña y turno");
      return;
    }

    try {
      const response = await pagarOrdinario({
        devotoId: devoto._id,
        turnoId: turnoSeleccionado._id,
        contraseña: contraseñaSeleccionada
      });

      // Limpiar estado
      setBusqueda("");
      setContraseñasDisponibles([]);
      setContraseñaSeleccionada("");
      setProcesionFiltrada(null);
      setTurnosProcesion([]);
      setTurnoSeleccionado(null);

      toast.success("Pago registrado exitosamente");

      if (response?.compra?.noFactura) {
        verFactura(response.compra.noFactura);
      } else {
        toast.error("No se pudo obtener la factura del pago");
      }
    } catch (error) {
      toast.error("Ocurrió un error al registrar el pago");
    }
  };

  return (
    <div> 
    {NavbarToShow} 
    <div className="max-w-3xl mx-auto p-6">
      {/* Encabezado */}
      <div className="bg-[#142130] text-white rounded-t-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Pago Turno Ordinario
        </h1>
        <p className="opacity-90 mt-1">Complete los datos requeridos para registrar una compra</p>
        <div className="mt-4 italic text-sm opacity-80 flex items-center gap-2">
          <span>"Nuestro Señor está en la Eucaristía esperando que le visitemos y le hablemos."</span>
        </div>
        <p className="text-xs opacity-70 text-right">— San Juan Bosco</p>
      </div>

      <div className="bg-white rounded-b-xl shadow-md divide-y divide-gray-200">
        {/* Búsqueda devoto */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#142130] mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Devoto
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#142130] focus:border-transparent transition-all"
              placeholder="Buscar por nombre, apellido o DPI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {sugerencias.length > 0 && (
            <ul className="mt-3 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {sugerencias.map((d) => (
                <li
                  key={d._id}
                  className="p-3 hover:bg-[#142130]/5 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  onClick={() => seleccionarDevoto(d)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-[#142130]/10 p-2 rounded-full mt-1">
                      <User className="h-4 w-4 text-[#142130]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#142130]">{d.nombre} {d.apellido}</p>
                      <p className="text-sm text-gray-600">DPI: {d.DPI || 'No registrado'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selección de contraseña */}
        {contraseñasDisponibles.length > 0 && (
        <div className="p-6">
          <label className="block text-sm font-medium text-[#142130] mb-2">
            Contraseña
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={contraseñaSeleccionada}
            onChange={(e) => seleccionarContraseña(e.target.value)}
          >
            <option value="">Seleccione una contraseña</option>
            {contraseñasDisponibles.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}
        {/* Información del devoto */}
        {devoto && (
          <div className="p-6 bg-[#142130]/5">
            <div className="flex items-start gap-4">
              <div className="bg-[#142130]/10 p-3 rounded-lg">
                <User className="h-6 w-6 text-[#142130]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#142130] mb-3">Información del Devoto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-medium text-[#142130]">{devoto.nombre} {devoto.apellido}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documento (DPI)</p>
                    <p className="font-medium text-[#142130]">{devoto.DPI || 'No registrado'}</p>
                  </div>
                  {contraseñaSeleccionada && (
                    <div>
                      <p className="text-sm text-gray-500">Contraseña seleccionada</p>
                      <p className="font-mono font-medium text-[#142130]">{contraseñaSeleccionada}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de procesión */}
        {procesionFiltrada && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#142130] mb-4 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Procesión
            </h2>
            <div className="flex items-center gap-3 bg-[#142130]/5 p-4 rounded-lg">
              <CalendarCheck className="h-5 w-5 text-[#142130]" />
              <p className="font-medium text-[#142130]">{procesionFiltrada.nombre}</p>
            </div>
          </div>
        )}

        {/* Selección de turno */}
        {procesionFiltrada && turnosProcesion.length > 0 && (
          <div className="p-6">
            <label className="block text-sm font-medium text-[#142130] mb-2">
              Turno disponible
            </label>
            <div className="relative">
              <select
                className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142130] focus:border-transparent appearance-none"
                value={turnoSeleccionado?._id || ""}
                onChange={(e) =>
                  setTurnoSeleccionado(
                    turnosProcesion.find((t) => (t._id || t.uid) === e.target.value)
                  )
                }
              >
                <option value=""> Seleccione un turno </option>
                {turnosProcesion
                  .filter((t) => t.tipoTurno === "ORDINARIO")
                  .map((t) => (
                    <option key={t._id || t.uid} value={t._id || t.uid}>
                      {t.noTurno} - {t.tipoTurno}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Botón de pago */}
        {turnoSeleccionado && (
          <div className="p-6 pt-0">
            <button
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                loadingPago ? 'bg-[#142130]/70' : 'bg-[#142130] hover:bg-[#142130]/90 shadow-md hover:shadow-lg'
              } flex items-center justify-center gap-2`}
              onClick={handlePagar}
              disabled={loadingPago}
            >
              {loadingPago ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando pago...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
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
