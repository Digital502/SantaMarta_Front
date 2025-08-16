import { useEffect, useState } from "react";
import {
  addProcesion,
  getProcesiones,
  getProcesionById,
  updateProcesion,
  deleteProcesion,
} from "../../services/api";
import toast from "react-hot-toast";

export const useProcesion = () => {
  const [procesiones, setProcesiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [procesion, setProcesion] = useState(null);
  const [error, setError] = useState(null);

  const fetchProcesiones = async () => {
    setLoading(true);
    const response = await getProcesiones();
    if (!response.error) {
      setProcesiones(response.procesiones || []);
    } else {
      setError("No se pudieron cargar las procesiones.");
    }
    setLoading(false);
  };

  const fetchProcesionById = async (id) => {
    setLoading(true);
    const response = await getProcesionById(id);
    if (!response.error) {
      setProcesion(response.procesion);
    } else {
      setError("No se pudo obtener la procesión.");
    }
    setLoading(false);
  };

  const createProcesion = async (data) => {
    setLoading(true);
    const response = await addProcesion(data);
    if (!response.error) {
      await fetchProcesiones();
      toast.success("Marchero registrado exitosamente.");
    } else {
      setError("No se pudo crear la procesión.");
    }
    setLoading(false);
  };

  const editProcesion = async (id, data) => {
    setLoading(true);
    const response = await updateProcesion(id, data);
    if (!response.error) {
      await fetchProcesiones();
      toast.success("Marchero actualizado exitosamente.");
    } else {
      setError("No se pudo actualizar la procesión.");
    }
    setLoading(false);
  };

  const removeProcesion = async (id) => {
    setLoading(true);
    const response = await deleteProcesion(id);
    if (!response.error) {
      await fetchProcesiones();
      toast.success("Marchero eliminado exitosamente.");
    } else {
      setError("No se pudo eliminar la procesión.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProcesiones();
  }, []);

  return {
    procesiones,
    procesion,
    loading,
    error,
    fetchProcesiones,
    fetchProcesionById,
    createProcesion,
    editProcesion,
    removeProcesion,
  };
};
