import { useState, useEffect } from "react";
import {
  listarFactura,
  getFacturaById,
  updateFactura,
  deleteFactura,
} from "../../services/api"
import toast from "react-hot-toast";

export const useFactura = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las facturas
  const fetchFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listarFactura();
      if (!response.error) {
        setFacturas(response.facturas || []);
      } else {
        setError("Error al cargar las facturas");
        toast.error("Error al cargar las facturas");
      }
    } catch (e) {
      setError("Error inesperado al cargar las facturas");
      toast.error("Error inesperado al cargar las facturas");
    }
    setLoading(false);
  };

  // Obtener factura por id y guardar en estado
  const fetchFacturaById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFacturaById(id);
      if (!response.error) {
        setFacturaSeleccionada(response.factura || null);
      } else {
        setError("Factura no encontrada");
        toast.error("Factura no encontrada");
      }
    } catch (e) {
      setError("Error inesperado al obtener la factura");
      toast.error("Error inesperado al obtener la factura");
    }
    setLoading(false);
  };

  // Actualizar factura
  const editFactura = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateFactura(id, data);
      if (!response.error) {
        toast.success("Factura actualizada correctamente");
        // Actualizar localmente la factura en el arreglo
        setFacturas((prev) =>
          prev.map((f) => (f.uid === id ? response.factura : f))
        );
        setFacturaSeleccionada(response.factura);
      } else {
        setError("Error al actualizar la factura");
        toast.error("Error al actualizar la factura");
      }
    } catch (e) {
      setError("Error inesperado al actualizar la factura");
      toast.error("Error inesperado al actualizar la factura");
    }
    setLoading(false);
  };

  // Eliminar factura (soft delete)
  const removeFactura = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteFactura(id);
      if (!response.error) {
        toast.success("Factura eliminada correctamente");
        setFacturas((prev) => prev.filter((f) => f.uid !== id));
        if (facturaSeleccionada?.uid === id) setFacturaSeleccionada(null);
      } else {
        setError("Error al eliminar la factura");
        toast.error("Error al eliminar la factura");
      }
    } catch (e) {
      setError("Error inesperado al eliminar la factura");
      toast.error("Error inesperado al eliminar la factura");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return {
    facturas,
    facturaSeleccionada,
    loading,
    error,
    fetchFacturas,
    fetchFacturaById,
    editFactura,
    removeFactura,
  };
};
