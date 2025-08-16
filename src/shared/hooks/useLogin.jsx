import { useNavigate } from "react-router-dom";
import { login } from "../../services";
import toast from "react-hot-toast";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (email, contraseña) => {
    try {
      setIsLoading(true);

      const response = await login({ email, contraseña });

      const userDetails = response.data?.userDetails;

      if (!userDetails) {
        toast.error("Detalles del usuario no encontrados en la respuesta.");
        return;
      }

      toast.success("Inicio de sesión exitoso");

      const role = userDetails.role;
      
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userDetails, role: role })
      );

      switch (role) {
        case "ROL_DIRECTIVO":
          navigate("/inicio", { replace: true });
          break;
        case "ROL_GENERAL":
          navigate("/inicioMiembro", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }

    } catch (error) {
      const errorText = error?.response?.data?.error?.toLowerCase() || "";

      if (errorText.includes("no user")) {
        toast.error("Correo electrónico incorrecto");
      } else if (errorText.includes("password")) {
        toast.error("Contraseña incorrecta");
      } else {
        toast.error(errorText || "Error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
  };
};