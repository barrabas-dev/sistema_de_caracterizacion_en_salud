import { useState } from 'react';
import { Menu, X, Home, Users, ClipboardList, LogOut, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navigation = [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Pacientes', href: '/pacientes/nuevo', icon: Users },
    { name: 'Encuestas', href: '/encuestas/nueva', icon: ClipboardList },
    { name: 'Gestión de PAE', href: '/encuestas/panel', icon: FileText },
  ];

  const getFirstLetter = (name) => {
    if (!name) return 'U';
    return String(name).charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col shadow-lg lg:shadow-none`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-indigo-600">
          <span className="text-xl font-bold text-white tracking-wide">Sistema SCS</span>
          <button 
            className="lg:hidden text-indigo-100 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 z-10 sticky top-0">
          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Panel de Control</h1>
          </div>

          <div className="flex items-center ml-auto space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">
                {user?.username || 'Usuario'}
              </span>
              <span className="text-xs font-medium text-indigo-600 capitalize bg-indigo-50 px-2 py-0.5 rounded-full mt-0.5">
                {user?.rol || user?.role || 'Personal'}
              </span>
            </div>
            
            <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-600 rounded-full font-bold text-lg ring-2 ring-indigo-100 shadow-md transform hover:scale-105 transition-transform duration-200 cursor-default">
              {getFirstLetter(user?.username)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Subtle background pattern for a premium feel */}
          <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[length:32px_32px] pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
