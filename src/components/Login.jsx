import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo_hermandad.png';
import { useLogin } from "../shared/hooks/useLogin";
import { Eye, EyeOff } from "lucide-react";
import {
  validateEmail,
  validatePassword,
  validateEmailMessage,
  validatePasswordMessage,
} from "../shared/validators";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(false);
  const navigate = useNavigate();
  const { loginUser, isLoading } = useLogin();

  const [formState, setFormState] = useState({
    email: { value: "", isValid: false, showError: false },
    contraseña: { value: "", isValid: false, showError: false },
  });

  const handleInputChange = (value, field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const handleBlur = (value, field) => {
    let isValid = false;
    if (field === "email") isValid = validateEmail(value);
    if (field === "contraseña") isValid = validatePassword(value);

    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        isValid,
        showError: !isValid,
      },
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setClickedLogin(true);
    loginUser(formState.email.value, formState.contraseña.value);
  };

  const isSubmitDisabled =
    isLoading || !formState.email.isValid || !formState.contraseña.isValid;

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/fondoImagen2.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[#0D1B2A]/70 z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-[#0D1B2A]/90 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl"
      >
        <div className="mt-0 flex justify-center">
          <img
            src={logo}
            alt="Logo Hermandad"
            className="h-20 opacity-80"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Iniciar Sesión</h2>
        <br />
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-1 text-white font-medium"
            >
              Correo Electrónico *
            </label>
            <input
              id="email"
              type="email"
              value={formState.email.value}
              onChange={(e) => handleInputChange(e.target.value, "email")}
              onBlur={(e) => handleBlur(e.target.value, "email")}
              required
              placeholder="nombre@correo.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#E0E1DD] text-[#0D1B2A] placeholder-[#415A77] focus:outline-none focus:ring-2 focus:ring-[#59818B]"
            />
            {formState.email.showError && (
              <p className="text-red-400 text-sm mt-1">{validateEmailMessage}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1 text-white font-medium"
            >
              Contraseña *
            </label>
            <div className="relative">
              <input
                id="contraseña"
                type={showPassword ? "text" : "password"}
                value={formState.contraseña.value}
                onChange={(e) => handleInputChange(e.target.value, "contraseña")}
                onBlur={(e) => handleBlur(e.target.value, "contraseña")}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-[#E0E1DD] text-[#0D1B2A] placeholder-[#415A77] focus:outline-none focus:ring-2 focus:ring-[#59818B] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#0D1B2A] hover:text-[#0D1B2A] transition"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {formState.contraseña.showError && (
              <p className="text-red-400 text-sm mt-1">{validatePasswordMessage}</p>
            )}
          </div>

          <p className="text-sm italic text-center text-[#86AFB9]">
            “No hay nada tan grande como la Eucaristía...”<br />
            <span className="not-italic font-medium">— San Juan María Vianney</span>
          </p>

          <motion.button
            type="submit"
            whileHover={!isSubmitDisabled ? { scale: 1.03 } : {}}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitDisabled}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#59818B] text-white hover:bg-[#426A73]"
            }`}
          >
            {isLoading ? "Cargando..." : "Ingresar"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
