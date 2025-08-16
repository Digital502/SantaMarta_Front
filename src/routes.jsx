import { HomePage } from "../src/pages/home/HomePage";
import { PagoComision } from "./components/compra/PagoComision";
import { PagoOrdinario } from "./components/compra/PagoOrdinario";
import { RegistrarCompra } from "./components/compra/RegistrarCompra";
import { ReservaTurno } from "./components/compra/ReservaTurno";
import { DevotosByTurno } from "./components/devoto/DevotosByTurno";
import { ListDevoto } from "./components/devoto/ListDevoto";
import { RegisterDevoto } from "./components/devoto/RegisterDevoto";
import { Factura } from "./components/factura/Factura";
import { HistorialVenta } from "./components/historialVenta/HistorialVenta";
import { NoAutorizado } from "./components/NoAutorizado";
import { NotFound } from "./components/notFound.jsx/NotFound";
import { PrivateRoute } from "./components/PrivateRoute";
import { Procesion } from "./components/procesiones/Procesion";
import { ProcesionDetails } from "./components/procesiones/ProcesionDetails";
import { Profile } from "./components/profile/Profile";
import { RegisterUser } from "./components/user/RegisterUser";
import { Users } from "./components/user/Users";
import { AuthPage } from "./pages/auth";
import { DashboardAdminPage } from "./pages/dashboardAdmin";
import { DashboardUserPage } from "./pages/dashboardUser";
import { PagoTurno } from "./pages/pago/PagoTurno";

export const routes = [
    {path: '/', element: <HomePage/>},
    {path: '/login', element: <AuthPage/>},
    {path: '/inicio', element: <DashboardAdminPage/>},
    {path: '/inicioMiembro', element: <DashboardUserPage/>},
    {path: '/directiva/registro-miembro', element: <PrivateRoute><RegisterUser/></PrivateRoute>},
    {path: '/directiva/lista-miembros', element: <PrivateRoute><Users/></PrivateRoute>},
    {path: '/configuracion/miperfil', element: <Profile/>},
    {path: '/directiva/marcheros', element: <PrivateRoute ><Procesion/></PrivateRoute>},
    {path: '/directiva/marcheros/:id', element: <PrivateRoute><ProcesionDetails/></PrivateRoute>},
    {path: '/unauthorized', element: <NoAutorizado/>},
    {path: '/register-devoto', element: <RegisterDevoto/>},
    {path: '/directiva/devotos', element: <PrivateRoute><ListDevoto/></PrivateRoute>},
    {path: '/registrar-compra', element: <RegistrarCompra/> },
    {path: '/directiva/facturas', element: <Factura/>},
    {path: '/directiva/historial-venta', element: <HistorialVenta/>},
    {path: '/directiva/datos-devoto', element: <DevotosByTurno/>},
    {path: '/pago-comision', element: <PagoComision/>},
    {path: '/pago-ordinario', element: <PagoOrdinario/>},
    {path: '/pago-turno', element: <PagoTurno/>},
    {path: '/reservar-turno', element: <ReservaTurno/>},
    {path: '*', element: <NotFound/>},
]