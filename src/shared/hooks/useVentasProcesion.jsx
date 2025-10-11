import { useState } from "react";
import { getVentasProcesion } from "../../services/api"

export const useVentasProcesion = () => {
    const [ventasProcesion, setVentasProcesion] = useState([]);
    const [totalProcesion, setTotalProcesion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVentasProcesion = async (procesionId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await getVentasProcesion(procesionId);

            if (response.error) {
                throw new Error("Error al obtener las ventas por procesión");
            }

            const { facturas, totalVendido } = response;

            setVentasProcesion(facturas || []);
            setTotalProcesion(totalVendido || 0);
        } catch (err) {
            console.error("Error en fetchVentasProcesion:", err);
            setError(err.message || "Error desconocido al cargar las ventas");
        } finally {
            setLoading(false);
        }
    };

    return {
        ventasProcesion,
        totalProcesion,
        loading,
        error,
        fetchVentasProcesion,
    };
};
