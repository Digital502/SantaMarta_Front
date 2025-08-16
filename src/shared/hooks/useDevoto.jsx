import { useEffect, useState } from "react";
import {
  addDevoto,
  getDevotos,
  getDevotoById,
  updateDevoto,
  deleteDevoto,
  getDevotoByTurno
} from "../../services/api";
import toast from "react-hot-toast";

export const useDevoto = () => {
  const [devotos, setDevotos] = useState([]);
  const [devotosPorTurno, setDevotosPorTurno] = useState([]);
  const [loading, setLoading] = useState(false);
  const [devoto, setDevoto] = useState(null);
  const [error, setError] = useState(null);

  const fetchDevotos = async () => {
    setLoading(true);
    const response = await getDevotos();
    if (!response.error) {
      setDevotos(response.devotos || []);
    } else {
      setError("No se pudieron cargar los devotos.");
    }
    setLoading(false);
  };

  const fetchDevotoById = async (id) => {
    setLoading(true);
    const response = await getDevotoById(id);
    if (!response.error) {
      setDevoto(response.devoto);
    } else {
      setError("No se pudo obtener el devoto.");
    }
    setLoading(false);
    return response;
  };

  // 🔹 Nuevo: obtener devotos por ID de turno
  const fetchDevotosByTurno = async (turnoId) => {
    setLoading(true);
    const response = await getDevotoByTurno(turnoId);
    if (!response.error) {
      setDevotosPorTurno(response.devotos || []);
    } else {
      setError("No se pudieron cargar los devotos de este turno.");
    }
    setLoading(false);
  };

  const createDevoto = async (data) => {
    setLoading(true);
    const response = await addDevoto(data);
    if (!response.error) {
      await fetchDevotos();
      toast.success("Devoto registrado exitosamente.");
    } else {
      setError("No se pudo crear el devoto.");
    }
    setLoading(false);
  };

  const editDevoto = async (id, data) => {
    setLoading(true);
    const response = await updateDevoto(id, data);
    if (!response.error) {
      await fetchDevotos();
      toast.success("Devoto actualizado exitosamente.");
    } else {
      setError("No se pudo actualizar el devoto.");
    }
    setLoading(false);
  };

  const removeDevoto = async (id) => {
    setLoading(true);
    const response = await deleteDevoto(id);
    if (!response.error) {
      await fetchDevotos();
      toast.success("Devoto eliminado exitosamente.");
    } else {
      setError("No se pudo eliminar el devoto.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevotos();
  }, []);

  return {
    devotos,
    devotosPorTurno, // 🔹 lista filtrada por turno
    devoto,
    loading,
    error,
    fetchDevotos,
    fetchDevotoById,
    fetchDevotosByTurno, // 🔹 nueva función
    createDevoto,
    editDevoto,
    removeDevoto,
  };
};
