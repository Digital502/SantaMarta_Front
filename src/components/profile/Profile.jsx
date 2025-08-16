import { useState } from "react";
import { useMyUser } from "../../shared/hooks/useMyUser";
import { NavbarAdmin } from "../navs/NavbarAdmin";
import { NavbarUser } from "../navs/NavbarUser";
import { Pencil, Save, X, Lock, Eye, EyeOff } from "lucide-react";
import { LoadingSpinner } from "../loadinSpinner/LoadingSpinner";

export const Profile = () => {
  const {
    user,
    fetchMyUser,
    updateMyUser,
    changePassword,
  } = useMyUser();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const NavbarToShow =
    user?.role === "ROL_DIRECTIVO" ? <NavbarAdmin /> : <NavbarUser />;

  if (!user) {
    return <div><LoadingSpinner/></div>;
  }

  const handleSave = async () => {
    await updateMyUser(formData);
    fetchMyUser();
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) return;
    await changePassword(passwordData);
    setPasswordData({ currentPassword: "", newPassword: "" });
    setShowPasswordForm(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/fondoPerfil.svg')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-0" />
      {NavbarToShow}

      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src={`https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=426A73&color=fff&size=128`}
              alt="Avatar"
              className="w-28 h-28 rounded-full mx-auto shadow-md border-4 border-white/20"
            />
            <h2 className="text-3xl font-bold mt-4">{user.nombre} {user.apellido}</h2>
            <p className="text-[#86AFB9] mt-1">
              {user.role === "ROL_DIRECTIVO" ? "Directivo" : "Miembro General"}
            </p>
            <br />
            <p className="text-lg italic text-[#86AFB9] mb-6 max-w-3xl mx-auto text-center leading-relaxed">
              "Nuestro Señor está en la Eucaristía esperando que le visitemos y le hablemos."<br />
              <span className="not-italic font-medium block mt-2">— San Juan Bosco</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nombre" value={formData.nombre ?? user.nombre} editable={isEditing} onChange={(v) => setFormData({ ...formData, nombre: v })} />
            <InputField label="Apellido" value={formData.apellido ?? user.apellido} editable={isEditing} onChange={(v) => setFormData({ ...formData, apellido: v })} />
            <InputField label="Teléfono" value={formData.telefono ?? user.telefono} editable={isEditing} onChange={(v) => setFormData({ ...formData, telefono: v })} />
            <InputField label="Dirección" value={formData.direccion ?? user.direccion} editable={isEditing} onChange={(v) => setFormData({ ...formData, direccion: v })} />
            <InputField label="Correo electrónico" value={user.email} editable={false} />
            <InputField label="No. DPI" value={user.DPI} editable={false} />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap justify-end gap-3 mt-8 border-t pt-6 border-white/10">
            {isEditing ? (
              <>
                <Button onClick={handleSave} icon={<Save size={16} />} text="Guardar" color="green" />
                <Button onClick={() => { setIsEditing(false); setFormData({}); }} icon={<X size={16} />} text="Cancelar" color="gray" />
              </>
            ) : (
              <>
                <Button onClick={() => { setIsEditing(true); setFormData(user); }} icon={<Pencil size={16} />} text="Editar perfil" color="#a4b0ec" />
                <Button onClick={() => setShowPasswordForm(!showPasswordForm)} icon={<Lock size={16} />} text="Cambiar contraseña" color="#a4b0ec" />
              </>
            )}
          </div>

          {/* Cambio de contraseña */}
          {showPasswordForm && (
            <div className="mt-6 border-t pt-6 border-white/10 space-y-4">
              <PasswordInput label="Contraseña actual" value={passwordData.currentPassword} onChange={(v) => setPasswordData({ ...passwordData, currentPassword: v })} />
              <PasswordInput label="Nueva contraseña" value={passwordData.newPassword} onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })} />
              <div className="flex justify-end gap-2">
                <Button onClick={handlePasswordChange} text="Guardar contraseña" color="green" />
                <Button onClick={() => setShowPasswordForm(false)} text="Cancelar" color="gray" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, editable, onChange }) => (
  <div>
    <label className="text-sm text-[#86AFB9]">{label}</label>
    {editable ? (
      <input
        className="w-full mt-1 p-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="mt-1">{value}</p>
    )}
  </div>
);

const PasswordInput = ({ label, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full mt-1 p-2 pr-10 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-4 right-2 text-white hover:text-gray-300"
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
};

const Button = ({ onClick, icon, text, color }) => {
  const isHex = color?.startsWith("#");
  const defaultClasses = "px-4 py-2 rounded text-sm font-semibold transition flex items-center gap-2";

  const dynamicStyle = isHex
    ? {
        backgroundColor: color,
        color: "#000",
      }
    : {};

  const classNames = isHex
    ? defaultClasses
    : `${defaultClasses} ${
        {
          green: "bg-green-600 hover:bg-green-700",
          gray: "bg-gray-600 hover:bg-gray-700",
          blue: "bg-blue-600 hover:bg-blue-700",
          yellow: "bg-yellow-600 hover:bg-yellow-700",
        }[color] || "bg-blue-600"
      }`;

  return (
    <button onClick={onClick} className={classNames} style={dynamicStyle}>
      {icon} {text}
    </button>
  );
};
