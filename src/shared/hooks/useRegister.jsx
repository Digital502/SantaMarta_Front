import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async ({
    nombre,
    apellido,
    DPI,
    direccion,
    telefono,
    email,
    role = "ROL_GENERAL",
  }) => {
    setIsLoading(true);

    try {
      const response = await register({
        nombre,
        apellido,
        DPI,
        direccion,
        telefono,
        email,
        role
      });

      if (response.error) {
        toast.error(
          response.e?.response?.data?.errors?.[0]?.msg ||
          "Error al registrar la cuenta"
        );
        return null;
      } else {
        toast.success(response.data.message);
        return response.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading
  };
};