import React, { useState, useRef, useEffect } from 'react';
import {
  ClipboardList,
  Users,
  UserPlus,
  BookOpen,
  CheckSquare,
  DollarSign,
  Archive,
  Download,
  File
} from 'lucide-react';
import { Footer } from '../../components/footer/Footer';
import { NavbarAdmin } from '../../components/navs/NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

export const DashboardAdminPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUserDetails();
  const profileRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!profileRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#E0E1DD] text-[#0D1B2A]">
      <NavbarAdmin />

      <main className="flex-1 px-6 py-12 max-w-7xl mx-auto">
        {/* Sección 1 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#0D1B2A] mb-2">Gestión Interna - {user ? `${user.nombre} ${user.apellido}` : 'Directivo'}</h2>
          <p className="text-[#415A77] mb-8 text-base">
            Administra los registros, información y operaciones internas de la hermandad con facilidad y control total.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              title="Registrar Miembro"
              icon={<UserPlus size={28} />}
              description="Registrar y crear cuenta para miembros de la hermandad."
              route="/directiva/registro-miembro"
              navigate={navigate}
            />
            <Card
              title="Ver Miembros"
              icon={<Users size={28} />}
              description="Consulta y gestiona la lista de miembros de la hermandad."
              route="/directiva/lista-miembros"
              navigate={navigate}
            />
            <Card
              title="Marcheros"
              icon={<ClipboardList size={28} />}
              description="Registra y visualiza el marchero de cada procesión."
              route="/directiva/marcheros"
              navigate={navigate}
            />
            <Card
              title="Información de Devotos"
              icon={<BookOpen size={28} />}
              description="Consulta los datos completos de cada devoto registrado."
              route="/directiva/devotos"
              navigate={navigate}
            />
            <Card
              title="Reservar Turno"
              icon={<CheckSquare size={28} />}
              description="Reserva medio turno o turno completo."
              route="/reservar-turno"
              navigate={navigate}
            />
            <Card
              title="Historial de Ventas"
              icon={<DollarSign size={28} />}
              description="Visualiza las ventas realizadas por cada miembro."
              route="/directiva/historial-venta"
              navigate={navigate}
            />
            <Card
              title="Descargar Datos de Turno"
              icon={<Download size={28} />}
              description="Descarga y visualizar los datos del devoto de cada turno."
              route="/directiva/datos-devoto"
              navigate={navigate}
            />
            <Card
              title="Historial de Facturas"
              icon={<File size={28} />}
              description="Visualiza los detalles de compra de turnos de cada devoto."
              route="/directiva/facturas"
              navigate={navigate}
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-[#0D1B2A] mb-2">Turnos y Devotos</h2>
          <p className="text-[#415A77] mb-8 text-base">
            Gestiona los turnos, pagos y registros de los devotos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              title="Registrar Devoto"
              icon={<UserPlus size={28} />}
              description="Agrega un nuevo devoto al sistema para su posterior asignación de turno."
              route="/register-devoto"
              navigate={navigate}
            />
            <Card
              title="Pago de Turnos"
              icon={<DollarSign size={28} />}
              description="Pago de Turnos Ordinarios y Comisiones con Devotos con Código."
              route="/pago-turno"
              navigate={navigate}
            />
            <Card
              title="Registro y Pago de Turno"
              icon={<CheckSquare size={28} />}
              description="Realiza el registro y el cobro del turno para los devotos sin Código."
              route="/registrar-compra"
              navigate={navigate}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const Card = ({ title, icon, description, route, navigate }) => (
  <div
    onClick={() => navigate(route)}
    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center cursor-pointer group"
  >
    <div className="text-[#1B263B] mb-3 group-hover:text-[#415A77] transition">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-[#0D1B2A] mb-1 group-hover:text-[#1B263B]">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-[#415A77]">{description}</p>
    )}
  </div>
);
