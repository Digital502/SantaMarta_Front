import { useState } from 'react';
import { useUsers } from '../../shared/hooks/useUsers';
import { Footer } from '../footer/Footer';
import { NavbarAdmin } from '../navs/NavbarAdmin';
import { Pencil, Trash2, X } from 'lucide-react';

export const Users = () => {
  const { users, isFetching, updateUseUser, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const filteredUsers = users.filter((usuario) =>
    [usuario.nombre, usuario.apellido].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <NavbarAdmin />

      <div className="p-6 bg-gradient-to-br from-[#E0E1DD] via-[#E0E1DD] to-[#E0E1DD] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-[#0f172a] backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-extrabold text-center text-[#fff] mb-8 tracking-wide">
            Miembros de la Hermandad
          </h2>
          <p className="text-center text-[#86AFB9] mb-9 max-w-3xl mx-auto">
            Consulta completa de todos los miembros registrados en la hermandad. Desde esta sección podrás visualizar y editar la información personal de cada integrante de forma rápida y segura.
          </p>

          {/* Buscador */}
          <div className="mb-6 relative max-w-md mx-auto">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o usuario..."
              className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-[#59818B]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabla de usuarios */}
          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-[#86AFB9] uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Apellido</th>
                  <th className="px-4 py-2 text-left">DPI</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Teléfono</th>
                  <th className="px-4 py-2 text-left">Dirección</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((usuario) => (
                    <tr
                      key={usuario.uid}
                      className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                    >
                      <td className="px-4 py-3 rounded-l-xl">{usuario.nombre}</td>
                      <td className="px-4 py-3">{usuario.apellido}</td>
                      <td className="px-4 py-3">{usuario.DPI}</td>
                      <td className="px-4 py-3">{usuario.email}</td>
                      <td className="px-4 py-3">{usuario.telefono}</td>
                      <td className="px-4 py-3">{usuario.direccion}</td>
                      <td className="px-4 py-3 text-center rounded-r-xl">
                        <button
                          onClick={() => handleOpenModal(usuario)}
                          className="bg-[#59818B] text-white hover:bg-[#426A73] transition-all px-4 py-2 rounded-md font-semibold"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-white/70">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            {/* Modal principal */}
            <div className="bg-[#1e293b]/95 text-white rounded-xl p-6 max-w-lg w-full mx-4 z-10 border border-[#59818B]/40 shadow-xl relative">

              {/* Encabezado */}
              <div className="flex justify-between items-center mb-4 border-b border-[#59818B]/30 pb-3">
                <h3 className="text-lg font-bold text-white">Perfil del Miembro</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-[#59818B] hover:text-[#fff] text-xl font-bold"
                  disabled={showConfirmDelete}
                >
                  ✕
                </button>
              </div>

              {/* Contenido principal */}
              {!showConfirmDelete ? (
                <>
                  {/* Información editable o no */}
                  <div className="space-y-4 text-base text-[#E0E1DD] leading-6">
                    {/* Nombre */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.nombre || ''}
                        onChange={(e) =>
                          setEditedUser((prev) => ({ ...prev, nombre: e.target.value }))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                        placeholder="Nombre"
                      />
                    ) : (
                      <p>
                        <span className="text-[#86AFB9] font-medium">Nombre:</span> {selectedUser.nombre} {selectedUser.apellido}
                      </p>
                    )}

                    {/* Apellido */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.apellido || ''}
                        onChange={(e) =>
                          setEditedUser((prev) => ({ ...prev, apellido: e.target.value }))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                        placeholder="Apellido"
                      />
                    ) : null}

                    {/* DPI */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.DPI || ''}
                        onChange={(e) =>
                          setEditedUser((prev) => ({ ...prev, DPI: e.target.value }))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                        placeholder="DPI"
                      />
                    ) : (
                      <p>
                        <span className="text-[#86AFB9] font-medium">DPI:</span> {selectedUser.DPI}
                      </p>
                    )}

                    {/* Correo */}
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email || ''}
                        onChange={(e) =>
                          setEditedUser((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                        placeholder="Correo"
                      />
                    ) : (
                      <p>
                        <span className="text-[#86AFB9] font-medium">Correo:</span> {selectedUser.email}
                      </p>
                    )}

                    {/* Teléfono */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.telefono || ''}
                        onChange={(e) =>
                          setEditedUser((prev) => ({ ...prev, telefono: e.target.value }))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                        placeholder="Teléfono"
                      />
                    ) : (
                      <p>
                        <span className="text-[#86AFB9] font-medium">Teléfono:</span> {selectedUser.telefono}
                      </p>
                    )}

                    {/* Dirección */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.direccion || ''}
                        onChange={(e) =>
                          setEditedUser((prev) => ({ ...prev, direccion: e.target.value }))
                        }
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                        placeholder="Dirección"
                      />
                    ) : (
                      <p>
                        <span className="text-[#86AFB9] font-medium">Dirección:</span> {selectedUser.direccion}
                      </p>
                    )}

                    {/* Rol editable con botones */}
                    {isEditing ? (
                      <div>
                        <span className="text-[#86AFB9] font-medium mr-4">Rol:</span>
                        <button
                          type="button"
                          onClick={() => setEditedUser((prev) => ({ ...prev, role: 'ROL_DIRECTIVO' }))}
                          className={`px-4 py-1 rounded-l-lg border border-[#59818B] font-semibold text-sm transition ${
                            editedUser.role === 'ROL_DIRECTIVO'
                              ? 'bg-[#59818B] text-white'
                              : 'bg-transparent text-[#86AFB9] hover:bg-[#426A73]'
                          }`}
                        >
                          Directivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditedUser((prev) => ({ ...prev, role: 'ROL_GENERAL' }))}
                          className={`px-4 py-1 rounded-r-lg border border-[#59818B] font-semibold text-sm transition ${
                            editedUser.role === 'ROL_GENERAL'
                              ? 'bg-[#59818B] text-white'
                              : 'bg-transparent text-[#86AFB9] hover:bg-[#426A73]'
                          }`}
                        >
                          General
                        </button>
                      </div>
                    ) : (
                      <p>
                        <span className="text-[#86AFB9] font-medium">Rol:</span>{' '}
                        {selectedUser.role === 'ROL_DIRECTIVO'
                          ? 'Directivo'
                          : selectedUser.role === 'ROL_GENERAL'
                          ? 'General'
                          : selectedUser.role}
                      </p>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-[#59818B]/20">
                    {isEditing ? (
                      <>
                        <button
                          onClick={async () => {
                            const success = await updateUseUser(selectedUser.uid, editedUser);
                            if (success) {
                              setIsEditing(false);
                              setShowModal(false);
                            }
                          }}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-white text-sm font-semibold transition"
                        >
                          <Pencil size={16} /> Guardar
                        </button>

                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-white text-sm font-semibold transition"
                        >
                          <X size={16} /> Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditedUser({ ...selectedUser });
                          }}
                          className="flex items-center gap-2 bg-[#59818B] hover:bg-[#426A73] px-3 py-2 rounded-lg text-white text-sm font-semibold transition"
                          disabled={showConfirmDelete}
                        >
                          <Pencil size={16} /> Editar
                        </button>

                        <button
                          onClick={() => setShowConfirmDelete(true)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white text-sm font-semibold transition"
                          disabled={showConfirmDelete}
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>

                        <button
                          onClick={handleCloseModal}
                          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-white text-sm font-semibold transition"
                          disabled={showConfirmDelete}
                        >
                          <X size={16} /> Cerrar
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-[#272f49] p-6 rounded-xl border border-[#59818B] shadow-lg w-full max-w-md text-center">
                  <p className="text-[#59818B]-200 font-bold text-lg mb-4">
                    ¿Estás seguro que deseas eliminar este usuario?
                  </p> 
                  <p className="text-[#59818B] font-bold text-lg mb-4">
                    {selectedUser.nombre} {selectedUser.apellido}
                    <br />
                    <br />
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        deleteUser(selectedUser.uid);
                        setShowConfirmDelete(false);
                        handleCloseModal();
                      }}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-semibold transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
