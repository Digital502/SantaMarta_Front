import { useState } from "react";
import { pagoComisiones, finalizarPago } from "../../services/api";
import toast from "react-hot-toast";

export const usePagoComision = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [respuestaPago, setRespuestaPago] = useState(null);

  const pagarComision = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagoComisiones(data);
      if (!response.error) {
        toast.success("Pago de comisión registrado correctamente.");
        setRespuestaPago(response);
      } else {
        setError("No se pudo registrar el pago de comisión.");
        toast.error("No se pudo registrar el pago de comisión.");
      }
      setLoading(false);
      return response;
    } catch (e) {
      setError("Error inesperado al registrar el pago de comisión.");
      toast.error("Error inesperado al registrar el pago de comisión.");
      setLoading(false);
      return { error: true, e };
    }
  };

  const registrarPago = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await finalizarPago(data);
      if (!response.error) {
        toast.success("Pago registrado exitosamente.");
        setRespuestaPago(response);
      } else {
        setError("No se pudo registrar el pago.");
        toast.error("No se pudo registrar el pago.");
      }
      setLoading(false);
      return response;
    } catch (e) {
      setError("Error inesperado al registrar el pago.");
      toast.error("Error inesperado al registrar el pago.");
      setLoading(false);
      return { error: true, e };
    }
  };

  return {
    loading,
    error,
    respuestaPago,
    pagarComision,
    registrarPago,
  };
};
