import React, { useEffect, useState } from "react";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useVentasProcesion } from "../../shared/hooks/useVentasProcesion";
import { useProcesion } from "../../shared/hooks/useProcesion";
import { Calendar } from "lucide-react";

export const VentasProcesion = () => {
    const { procesiones } = useProcesion();
    const { ventasProcesion, totalProcesion, loading, error, fetchVentasProcesion } = useVentasProcesion();

    const [procesionId, setProcesionId] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    useEffect(() => {
        if (procesionId) {
            fetchVentasProcesion(procesionId);
        }
    }, [procesionId]);

    const ventasFiltradas = fechaFiltro
        ? ventasProcesion.filter((venta) => {
            const fechaVenta = new Date(venta.fechaFactura);
            const fechaVentaStr = fechaVenta.toLocaleDateString("en-CA");
            return fechaVentaStr === fechaFiltro;
        })
        : ventasProcesion;

    const totalPorFecha = ventasFiltradas.reduce(
        (acc, venta) => acc + Number(venta.montoTotal || 0),
        0
    );

    const totalGeneral = Number(totalProcesion || 0);

    return (
        <div className="min-h-screen flex flex-col">
            <NavbarAdmin />

            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-[#2B535C] mb-6 text-center">
                    Ventas por Procesión
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    <select
                        value={procesionId}
                        onChange={(e) => setProcesionId(e.target.value)}
                        className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#426A73] outline-none text-gray-700"
                    >
                        <option value="">Seleccione una procesión</option>
                        {procesiones.map((p) => (
                            <option key={p.uid} value={p.uid}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>

                    <div className="relative w-full md:w-1/3">
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#426A73] outline-none bg-white text-gray-700 hover:border-[#59818B] transition"
                        />
                    </div>
                </div>

                {loading && <p className="text-center text-gray-500">Cargando...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {ventasFiltradas.length > 0 && (
                    <div className="mt-6 p-6 rounded-xl shadow-lg bg-gradient-to-r from-[#59818B] to-[#426A73] text-white text-center transform hover:scale-105 transition">
                        <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                            Total Vendido
                        </h2>
                        <p className="text-3xl font-bold">
                            Q{fechaFiltro ? totalPorFecha.toFixed(2) : totalGeneral.toFixed(2)}
                        </p>
                        {fechaFiltro && (
                            <p className="mt-2 text-sm opacity-80">
                                Total general: Q{totalGeneral.toFixed(2)}
                            </p>
                        )}
                    </div>
                )}
                <br />
                {ventasFiltradas.length > 0 && (
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-[#426A73] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">#Factura</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Devoto</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Turno</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ventasFiltradas.map((venta, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{venta.noFactura || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{venta.devoto || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{venta.turno || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(venta.fechaFactura).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#2B535C]">
                                            Q{Number(venta.montoTotal || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
