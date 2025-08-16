import { useEffect, useState } from "react";
import {
  addTurno,
  getTurnos,
  getTurnoById,
  updateTurno,
  deleteTurno,
  getTurnosByProcesion,
  descargarInventario
} from "../../services/api";
import toast from "react-hot-toast";

export const useTurno = () => {
  const [turnos, setTurnos] = useState([]);
  const [turnosPorProcesion, setTurnosPorProcesion] = useState([]);
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTurnos = async () => {
    setLoading(true);
    const response = await getTurnos();
    if (!response.error) {
      setTurnos(response.turnos || []);
    } else {
      setError("No se pudieron cargar los turnos.");
    }
    setLoading(false);
  };

  const fetchTurnosByProcesion = async (procesionId) => {
      setLoading(true);
      const response = await getTurnosByProcesion(procesionId);
      setLoading(false);

      if (!response.error) {
        const turnosObtenidos = response.turnos || [];
        setTurnosPorProcesion(turnosObtenidos);
        return turnosObtenidos;
      } else {
        setError("No se pudieron cargar los turnos de la procesión.");
        setTurnosPorProcesion([]);
        return [];
      }
    };

  const fetchTurnoById = async (id) => {
    setLoading(true);
    const response = await getTurnoById(id);
    if (!response.error) {
      setTurno(response.turno);
    } else {
      setError("No se pudo obtener el turno.");
    }
    setLoading(false);
  };

  const createTurno = async (data) => {
    setLoading(true);
    const response = await addTurno(data);
    if (!response.error) {
      toast.success("Turno registrado exitosamente.");
      await fetchTurnos();
      if (data.procesion) {
        await fetchTurnosByProcesion(data.procesion);
      }
    } else {
      setError("No se pudo crear el turno.");
    }
    setLoading(false);
  };

  const editTurno = async (id, data) => {
    setLoading(true);
    const response = await updateTurno(id, data);
    if (!response.error) {
      toast.success("Turno actualizado exitosamente.");
      await fetchTurnos();
      if (data.procesion) {
        await fetchTurnosByProcesion(data.procesion);
      }
    } else {
      setError("No se pudo actualizar el turno.");
    }
    setLoading(false);
  };

  const removeTurno = async (id, procesionId) => {
    setLoading(true);
    const response = await deleteTurno(id);
    if (!response.error) {
      toast.success("Turno eliminado exitosamente.");
      await fetchTurnos();
      if (procesionId) {
        await fetchTurnosByProcesion(procesionId);
      }
    } else {
      setError("No se pudo eliminar el turno.");
    }
    setLoading(false);
  };

  const downloadInventario = async (procesionId) => {
  try {
    const pdfBlob = await descargarInventario(procesionId);
    const contentType = pdfBlob?.type || '';
    if (contentType !== 'application/pdf') {
      throw new Error('El archivo recibido no es un PDF válido');
    }

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    const nombreArchivo = `Turnos_Procesion_${procesionId}.pdf`;

    link.href = url;
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success('PDF generado y descargado exitosamente.');
  } catch (err) {
    toast.error('Error al generar el PDF. Verifica que la procesión exista.');
    console.error('Error al descargar PDF:', err);
  }
};


  useEffect(() => {
    fetchTurnos();
  }, []);

  return {
    turnos,
    turnosPorProcesion,
    turno,
    loading,
    error,
    fetchTurnos,
    fetchTurnosByProcesion,
    fetchTurnoById,
    createTurno,
    editTurno,
    removeTurno,
    downloadInventario
  };
};
