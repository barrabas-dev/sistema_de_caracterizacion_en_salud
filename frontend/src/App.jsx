import { Plus, ClipboardList } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import StatsSection from './components/StatsSection';
import TablaPacientes from './components/TablaPacientes';
import PacienteForm from './components/PacienteForm';
import EncuestaForm from './components/EncuestaForm';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardView = () => (
  <>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hola, Administrador</h1>
        <p className="text-gray-500 mt-2 text-sm">Aquí está el resumen de la actividad reciente del sistema de caracterización.</p>
      </div>
      <div className="flex gap-3">
        <Link 
          to="/encuestas/nueva"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ClipboardList className="w-5 h-5" />
          Nueva Encuesta
        </Link>
        
        <Link 
          to="/pacientes/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Plus className="w-5 h-5" />
          Nuevo Paciente
        </Link>
      </div>
    </div>
    
    <StatsSection />
    
    <TablaPacientes />
  </>
);

const PacienteWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
        <p className="text-gray-500 mt-1 text-sm">Ingresa los datos del nuevo paciente en el sistema de caracterización.</p>
      </div>
      <PacienteForm onCancel={() => navigate('/dashboard')} />
    </div>
  );
};

const EncuestaWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Encuestas Clínicas</h1>
        <p className="text-gray-500 mt-1 text-sm">Registra una nueva encuesta médica para un paciente existente.</p>
      </div>
      <EncuestaForm onCancel={() => navigate('/dashboard')} />
    </div>
  );
};

const DashboardLayoutWrapper = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayoutWrapper />}>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/pacientes/nuevo" element={<PacienteWrapper />} />
            <Route path="/encuestas/nueva" element={<EncuestaWrapper />} />
          </Route>
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
