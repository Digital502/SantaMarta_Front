import React from 'react';
import {
    UserPlus,
    DollarSign,
    CheckSquare,
} from 'lucide-react';
import { Footer } from '../../components/footer/Footer';
import { NavbarUser } from '../../components/navs/NavbarUser';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { useNavigate } from 'react-router-dom';

export const DashboardUserPage = () => {
    const { user } = useUserDetails();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-[#E0E1DD] text-[#0D1B2A]">
            <NavbarUser />

            <main className="flex-1 px-6 py-16 max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2">Panel de Miembro - {user ? `${user.nombre} ${user.apellido}` : 'Miembro General'}</h2>
                <p className="text-[#415A77] text-base mb-12">
                    Como miembro autorizado de la Hermandad, puedes registrar devotos y turnos.
                </p>
                <p className="text-1.5xl italic text-[#415A77]">
                    "Cuando miras al Crucifijo, comprendes cuánto te amó Jesús. Cuando miras la Eucaristía, comprendes cuánto te ama ahora."<br />
                    <span className="not-italic font-medium">— Santa Teresa de Calcuta</span>
                </p>
                <br /><br />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    <CircleCard
                        icon={<UserPlus size={32} />}
                        title="Registrar Devoto"
                        description="Ingresa tus datos personales para participar en la procesión."
                        route="/register-devoto"
                        navigate={navigate}
                    />
                    <CircleCard
                        icon={<DollarSign size={32} />}
                        title="Pago de Turno"
                        description="Realiza el pago correspondiente a tu turno asignado."
                        route="/pago-turno"
                        navigate={navigate}
                    />
                    <CircleCard
                        icon={<CheckSquare size={32} />}
                        title="Registro y Pago"
                        description="Registra y paga tu turno en un solo paso fácil y rápido."
                        route="/registrar-compra"
                        navigate={navigate}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

const CircleCard = ({ icon, title, description, route, navigate }) => (
    <div onClick={() => navigate(route)} 
        className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#1B263B] text-white mb-4 shadow-lg">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-1">{title}</h3>
        <p className="text-sm text-[#415A77]">{description}</p>
    </div>
);
