import { useEffect, useState } from "react";
import {
  addDevoto,
  getDevotos,
  getDevotoById,
  updateDevoto,
  deleteDevoto,
  getDevotoByTurno,
  getSearchDevotos,   // 👈 ojo: aquí usa el plural
  getDevotosPaginacion
} from "../../services/api";
import toast from "react-hot-toast";

export const useDevoto = () => {
  const [devotos, setDevotos] = useState([]);
  const [devotosPorTurno, setDevotosPorTurno] = useState([]);
  const [loading, setLoading] = useState(false);
  const [devoto, setDevoto] = useState(null);
  const [error, setError] = useState(null);

  // 🔎 Estados para búsqueda
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0);

  // 📄 Estados para paginación general
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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

  const fetchDevotosPaginacion = async (newPage = page, newLimit = limit) => {
    setLoading(true);
    const response = await getDevotosPaginacion(newPage, newLimit);
    if (!response.error) {
      setDevotos(response.devotos || []);
      setPage(response.page);
      setLimit(response.limit);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } else {
      setError("No se pudieron cargar los devotos paginados.");
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
      await fetchDevotosPaginacion(page, limit);
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
      await fetchDevotosPaginacion(page, limit);
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
      await fetchDevotosPaginacion(page, limit);
      toast.success("Devoto eliminado exitosamente.");
    } else {
      setError("No se pudo eliminar el devoto.");
    }
    setLoading(false);
  };

  // 🔎 Buscar con paginación en backend
  const searchDevotos = async (query, newPage = 1, newLimit = limit) => {
    if (!query || query.trim().length < 4) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }
    setLoading(true);
    const response = await getSearchDevotos(query, newPage, newLimit);
    if (!response.error) {
      setSearchResults(response.devotos || []);
      setSearchQuery(query);
      setSearchPage(response.page);
      setSearchTotal(response.total);
      setSearchTotalPages(response.totalPages);
    } else {
      setError("Error en la búsqueda de devotos.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevotosPaginacion(1, limit);
  }, [limit]);

  return {
    // datos normales
    devotos,
    devotosPorTurno,
    devoto,
    loading,
    error,

    // paginación general
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,

    // búsqueda
    searchResults,
    searchQuery,
    searchPage,
    searchTotal,
    searchTotalPages,
    searchDevotos,
    setSearchPage,

    // acciones
    fetchDevotos,
    fetchDevotosPaginacion,
    fetchDevotoById,
    fetchDevotosByTurno,
    createDevoto,
    editDevoto,
    removeDevoto,
  };
};
