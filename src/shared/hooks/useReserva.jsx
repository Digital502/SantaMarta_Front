import { useState } from "react";
import { reservarTurno } from "../../services/api"; 

export const useReserva = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const reservar = async (payload) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await reservarTurno(payload);

      if (res.error) {
        setError(res.e?.response?.data || "Error desconocido");
      } else {
        setData(res);
      }

      return res;
    } catch (err) {
      setError(err?.response?.data || "Error desconocido");
      return { error: true, e: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    reservar,
    loading,
    error,
    data
  };
};
