import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://santamarta-back.onrender.com/santaMarta/api/v1/",
    timeout: 3000,
    httpsAgent: false
});

apiClient.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (data) => {
    return await apiClient.post('/auth/login', data);
};

export const register = async (data) => {
    try {
        return await apiClient.post('/auth/register', data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUsers = async () => {
    try {
        const response = await apiClient.get(`/user/getUsers`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/user/getUser/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateUser = async (id, data) => {
    try {
        const response = await apiClient.put(`/user/getUpdateUser/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteUser = async (id) => {
    try {
        return await apiClient.delete(`/user/getDeleteUser/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getMyUser = async () => {
    try {
        const response = await apiClient.get(`/user/getMyUser`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateUseruser = async (userId, data) => {
    try {
        const response = await apiClient.put(`/user/updateMyUser/${userId}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updatePassword = async (data) => {
    try {
        const response = await apiClient.put(`/user/updatePassword`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addProcesion = async (data) => {
    try {
        const response = await apiClient.post(`/procesion/addProcesiones`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getProcesiones = async () => {
    try {
        const response = await apiClient.get(`/procesion/getProcesiones`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getProcesionById = async (id) => {
    try {
        const response = await apiClient.get(`/procesion/getProcesionesById/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateProcesion = async (id, data) => {
    try {
        const response = await apiClient.put(`/procesion/updateProcesion/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteProcesion = async (id) => {
    try {
        return await apiClient.delete(`/procesion/deleteProcesion/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addTurno = async (data) => {
    try {
        const response = await apiClient.post(`/turno/addTurno`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getTurnos = async () => {
    try {
        const response = await apiClient.get(`/turno/getTurnos`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getTurnoById = async (id) => {
    try {
        const response = await apiClient.get(`/turno/getTurnoById/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateTurno = async (id, data) => {
    try {
        const response = await apiClient.put(`/turno/updateTurno/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteTurno = async (id) => {
    try {
        return await apiClient.delete(`/turno/deleteTurno/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getTurnosByProcesion = async (procesionId) => {
    try {
        const response = await apiClient.get(`/turno/getTurnosByProcesion/${procesionId}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const descargarInventario = async (procesionId) => {
    try {
        const response = await apiClient.get(`/turno/descargarInventario/${procesionId}`,{
            responseType: 'blob',
        })
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addDevoto = async (data) => {
    try {
        const response = await apiClient.post(`/devoto/addDevoto`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getDevotos = async () => {
    try {
        const response = await apiClient.get(`/devoto/getDevotos`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getDevotoById = async (id) => {
    try {
        const response = await apiClient.get(`/devoto/getDevotoById/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateDevoto = async (id, data) => {
    try {
        const response = await apiClient.put(`/devoto/updateDevoto/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteDevoto = async (id) => {
    try {
        return await apiClient.delete(`/devoto/deleteDevoto/${id}`);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const crearCompra = async (data) => {
    try {
        const response = await apiClient.post(`/compra/registrarCompra`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const listarFactura = async () => {
    try{
        const response = await apiClient.get(`/compra/listFacturas`)
        return response.data
    }catch(e) {
        return {
            error: true,
            e
        }
    }
}

export const getFacturaById = async (id) => {
    try{
        const response = await apiClient.get(`/compra/facturaById/${id}`)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const updateFactura = async (id, data) => {
    try{
        const response = await apiClient.put(`/compra/updateFactura/${id}`, data)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const deleteFactura = async (id) => {
    try{
        const response = await apiClient.delete(`/compra/deleteFactura/${id}`)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const historialVenta = async (id) => {
    try{
        const response = await apiClient.get(`/compra/historialVenta/${id}`)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const getDevotoByTurno = async (id) => {
    try{
        const response = await apiClient.get(`/devoto/devotosByTurno/${id}`)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const getGenerarFactura = async (id) => {
    try{
        const response = await apiClient.get(`/compra/generarFacturaPDF/${id}`,{
            responseType: 'blob',
        })
        return response.data
    }catch(e){
        return{
            error: true,
            e
        }
    }
}

export const pagoComisiones = async (data) => {
    try{
        const response = await apiClient.put(`/compra/pagarComision`,data)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const finalizarPago = async (data) => {
    try{
        const response = await apiClient.put(`/compra/registrarPago`,data)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const pagoOrdinario = async (data) => {
    try{
        const response = await apiClient.post(`/compra/pagoOrdinario`, data)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const reservarTurno = async (data) => {
    try{
        const response = await apiClient.post(`/compra/reservarTurno`, data)
        return response.data
    }catch(e){
        return {
            error: true,
            e
        }
    }
}

export const getSearchDevoto = async (query) => {
  try {
    const response = await apiClient.get(`/devoto/search?q=${query}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const getDevotosPaginacion = async (page, limit) => {
  try {
    const response = await apiClient.get(`/devoto/getDevotosPaginacion?page=${page}&limit=${limit}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
        e, 
    };
  }
};

export const getSearchDevotos = async (query, page, limit) => {
  try {
    const response = await apiClient.get(`/devoto/search/devotos/?q=${query}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
        e, 
    };
  }
};
