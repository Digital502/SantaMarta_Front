import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { Footer } from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateNumber,
  validateText,
  validateDPI,
  validateTextMessage,
  validateDPIMessage,
  validateNumberMessage,
  validateEmailMessage
} from "../../shared/validators";
import { useRegister } from "../../shared/hooks/useRegister";

export const RegisterUser = () => {
  const { registerUser, isLoading } = useRegister();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    nombre: { value: "", isValid: false, showError: false, isFocused: false },
    apellido: { value: "", isValid: false, showError: false, isFocused: false },
    DPI: { value: "", isValid: false, showError: false, isFocused: false },
    direccion: { value: "", isValid: false, showError: false, isFocused: false },
    telefono: { value: "", isValid: false, showError: false, isFocused: false },
    email: { value: "", isValid: false, showError: false, isFocused: false },
    role: { value: "ROL_GENERAL", isValid: true, showError: false },
  });

  const [showModal, setShowModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [clickedRegister, setClickedRegister] = useState(false);

  const handleInputChange = (value, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { 
        ...prev[field], 
        value,
        showError: false 
      }
    }));
  };

  const handleFocus = field => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], isFocused: true }
    }));
  };

  const handleBlur = field => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], isFocused: false }
    }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "nombre":
      case "apellido":
      case "direccion":
        return validateText(value);
      case "DPI":
        return validateDPI(value);
      case "telefono":
        return validateNumber(value);
      case "email":
        return validateEmail(value);
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClickedRegister(true);
    
    const updatedState = { ...formState };
    let formIsValid = true;

    const requiredFields = ["nombre", "apellido", "DPI", "direccion", "telefono", "email"];
    
    requiredFields.forEach(field => {
      const isValid = validateField(field, updatedState[field].value);
      updatedState[field] = {
        ...updatedState[field],
        isValid,
        showError: !isValid
      };
      if (!isValid) formIsValid = false;
    });

    setFormState(updatedState);

    if (!formIsValid) return;

    try {
      const response = await registerUser({
        nombre: formState.nombre.value,
        apellido: formState.apellido.value,
        DPI: formState.DPI.value,
        direccion: formState.direccion.value,
        telefono: formState.telefono.value,
        email: formState.email.value,
        role: formState.role.value,
      });
      
      if (response) {
        setRegistrationData(response);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/inicio");
  };

  const allFieldsFilled = () => {
    const requiredFields = ["nombre", "apellido", "DPI", "direccion", "telefono", "email"];
    return requiredFields.every(field => formState[field].value.trim() !== "");
  };

  const isSubmitDisabled = isLoading || !allFieldsFilled();

  const renderInput = (field, label, type = "text", errorMessage) => {
    const state = formState[field];
    return (
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <input
          type={type}
          id={field}
          value={state.value}
          onChange={e => handleInputChange(e.target.value, field)}
          onFocus={() => handleFocus(field)}
          onBlur={() => handleBlur(field)}
          className={`w-full bg-[#E0E1DD] text-[#142130] border ${
            state.showError ? "border-red-500" : "border-[#59818B]"
          } rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-[#59818B] peer transition`}
        />
        <label
          htmlFor={field}
          className={`absolute left-4 ${
            state.value || state.isFocused
              ? "top-1 text-xs text-[#59818B]"
              : "top-1/2 -translate-y-1/2 text-gray-400"
          } peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#59818B] transition-all duration-200`}
        >
          {label}
        </label>
        {state.showError && (
          <motion.p 
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errorMessage || "Este campo es requerido"}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div>
      <NavbarAdmin />
      <main className="min-h-screen flex items-center justify-center bg-[#E0E1DD] px-6 py-12 text-[#E0E1DD] pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-3xl bg-[#142130] rounded-2xl shadow-xl p-10 space-y-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2 text-[#E0E1DD] tracking-tight">
              Registro de Usuario
            </h2>
            <p className="text-gray-400">
              Registra a los miembros activos de la hermandad.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("nombre", "Nombre", "text", validateTextMessage)}
            {renderInput("apellido", "Apellido", "text", validateTextMessage)}
            {renderInput("DPI", "DPI", "text", validateDPIMessage)}
            {renderInput("direccion", "Dirección", "text", validateTextMessage)}
            {renderInput("telefono", "Teléfono", "tel", validateNumberMessage)}
            {renderInput("email", "Correo", "email", validateEmailMessage)}

            <div className="md:col-span-2 text-center">
              <p className="text-2sm italic text-[#86AFB9] mb-2">
                "Una sola Misa escuchada durante la vida es más valiosa que muchos bienes materiales dejados en herencia."<br />
                <span className="not-italic font-medium">— San Juan Bosco</span>
              </p>
              <br />
              <motion.button
                type="submit"
                disabled={isSubmitDisabled}
                whileHover={!isSubmitDisabled ? { 
                  scale: 1.03,
                  boxShadow: "0 0 15px #59818B"
                } : {}}
                whileTap={{ scale: 0.97 }}
                animate={{ scale: clickedRegister ? 0.97 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold shadow-md transition ${
                  isSubmitDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#59818B] hover:bg-[#426A73] text-white"
                }`}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Creando cuenta...
                  </motion.span>
                ) : "Crear Cuenta"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo con imagen - Versión corregida */}
            <div className="absolute inset-0 overflow-hidden">
            <img 
                src="/fondoModal2.jpg"  
                alt="Fondo decorativo del modal"
                className="w-full h-full object-cover"
            />
            {/* Overlay para oscurecer y mejorar legibilidad */}
            <div className="absolute inset-0 bg-[#0D1B2A]/80"></div>
            </div>
            
            {/* Contenido del modal */}
            <div className="bg-[#142130]/90 border-2 border-[#59818B]/50 rounded-xl p-6 max-w-md w-full mx-4 relative z-10 backdrop-blur-sm shadow-xl">
            <div className="flex justify-end">
                <button 
                onClick={handleCloseModal}
                className="text-[#59818B] hover:text-[#426A73] text-xl font-bold"
                >
                ✕
                </button>
            </div>
            
            <h3 className="font-bold text-2xl text-[#59818B] mb-4 text-center">¡Registro Exitoso!</h3>
            
            {registrationData && (
                <div className="space-y-4">
                <div className="bg-[#1e293b]/90 p-4 rounded-lg border border-[#59818B]">
                    <h4 className="text-lg font-semibold text-[#86AFB9] mb-2">Usuario:</h4>
                    <div className="space-y-2">
                    <p className="text-white font-medium">
                        {registrationData.nombre} {registrationData.apellido}
                    </p>
                    <p className="text-gray-300">
                        Correo: <span className="text-white">{registrationData.email}</span>
                    </p>
                    </div>
                </div>
                
                <div className="bg-[#1e293b]/90 border border-yellow-500/50 text-yellow-300 p-3 rounded-lg flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Para mayor seguridad, las credenciales del usuario fueron enviadas por correo.</span>
                </div>
                </div>
            )}
            
            <div className="mt-6 flex justify-end">
                <button 
                className="bg-[#59818B] hover:bg-[#426A73] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                onClick={handleCloseModal}
                >
                Continuar
                </button>
            </div>
            </div>
        </div>
        )}
      <Footer />
    </div>
  );
};