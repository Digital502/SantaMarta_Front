import { useState, useEffect } from "react";
import { historialVenta } from "../../services/api";
import toast from "react-hot-toast";

export const useHistorialVenta = (usuarioId) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistorial = async () => {
    if (!usuarioId) return;

    setLoading(true);
    setError(null);

    try {
        const response = await historialVenta(usuarioId);

        if (response.historial) {
        setHistorial(response.historial);
        } else {
        setError(response.message || "Error al cargar el historial de ventas");
        toast.error(response.message || "Error al cargar el historial de ventas");
        setHistorial([]);
        }
    } catch (e) {
        setError("Error inesperado al cargar el historial de ventas");
        toast.error("Error inesperado al cargar el historial de ventas");
        setHistorial([]);
    }
    setLoading(false);
    };

  // Recarga historial cada vez que cambia usuarioId
  useEffect(() => {
    fetchHistorial();
  }, [usuarioId]);

  return {
    historial,
    loading,
    error,
    fetchHistorial,
  };
};
