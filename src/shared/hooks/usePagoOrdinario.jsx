import { useState, useCallback } from 'react';
import { pagoOrdinario } from '../../services/api'; 

export const usePagoOrdinario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const ejecutarPago = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const respuesta = await pagoOrdinario(payload);
      if (respuesta?.error) {
        setError(respuesta.e || 'Error al procesar el pago');
      } else {
        setData(respuesta);
      }
      return respuesta;
    } catch (err) {
      setError(err);
      return { error: true, e: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pagar: ejecutarPago,
    loading,
    error,
    data
  };
};
