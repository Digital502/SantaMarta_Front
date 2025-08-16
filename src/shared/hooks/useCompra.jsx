import { useState } from "react";
import { crearCompra as apiCrearCompra } from "../../services/api";
import { getGenerarFactura } from "../../services/api"; 
import toast from "react-hot-toast";

export const useCompra = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCompra = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCrearCompra(data);
      if (!response.error) {
        toast.success("Compra creada exitosamente.");
      } else {
        setError("No se pudo crear la compra.");
        toast.error("No se pudo crear la compra.");
      }
      setLoading(false);
      return response;
    } catch (e) {
      setError("Error inesperado al crear la compra.");
      toast.error("Error inesperado al crear la compra.");
      setLoading(false);
      return { error: true, e };
    }
  };

  const verFactura = async (id) => {
    try {
      const pdfBlob = await getGenerarFactura(id);
      if (pdfBlob.error) {
        toast.error("No se pudo generar la factura.");
        return;
      }
      const fileURL = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );
      window.open(fileURL, "_blank");
    } catch (e) {
      toast.error("Error al visualizar la factura.");
    }
  };

  return {
    compras,
    loading,
    error,
    createCompra,
    verFactura, 
  };
};
