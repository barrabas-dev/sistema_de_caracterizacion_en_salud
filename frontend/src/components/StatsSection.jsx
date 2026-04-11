import { useState, useEffect } from 'react';
import { Users, CalendarCheck, ClipboardList, Clock, Loader2 } from 'lucide-react';
import api from '../services/api';
import StatCard from './StatCard'; // Asumo que tienes este subcomponente o usas el HTML directo

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalPacientes: 0,
    encuestasHoy: 0,
    totalEncuestas: 0,
    planesPendientes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Hacemos ambas peticiones al mismo tiempo para mayor velocidad
        const [pacientesRes, encuestasRes] = await Promise.all([
          api.get('pacientes/'),
          api.get('encuestas/')
        ]);

        // Extraemos los arrays (manejando posible paginación de DRF)
        const pacientes = pacientesRes.data.results || pacientesRes.data;
        const encuestas = encuestasRes.data.results || encuestasRes.data;

        // --- CÁLCULOS LOGICOS ---
        
        // 1. Total Pacientes
        const totalPac = pacientes.length;
        
        // 2. Total Encuestas
        const totalEnc = encuestas.length;

        // 3. Encuestas Hoy (Comparamos fechas YYYY-MM-DD)
        const hoy = new Date().toISOString().split('T')[0];
        const encHoy = encuestas.filter(e => e.fecha_recoleccion === hoy).length;

        // 4. Planes Pendientes (Encuestas que aún NO tienen plan asociado)
        const planesPend = encuestas.filter(e => !e.tiene_plan).length;

        // Actualizamos el estado con los valores reales
        setStats({
          totalPacientes: totalPac,
          encuestasHoy: encHoy,
          totalEncuestas: totalEnc,
          planesPendientes: planesPend
        });

      } catch (error) {
        console.error("Error al cargar las estadísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Si está cargando, mostramos un pequeño indicador
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32 text-indigo-600 mb-8">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-medium">Calculando métricas...</span>
      </div>
    );
  }

  // Preparamos los datos para renderizar las tarjetas
  const statsData = [
    {
      title: 'Total Pacientes',
      value: stats.totalPacientes,
      icon: Users,
      change: 'Registrados en DB',
      changeType: 'neutral',
      color: 'blue'
    },
    {
      title: 'Encuestas Hoy',
      value: stats.encuestasHoy,
      icon: CalendarCheck,
      change: 'Trabajo diario',
      changeType: stats.encuestasHoy > 0 ? 'positive' : 'neutral',
      color: 'emerald'
    },
    {
      title: 'Total Encuestas',
      value: stats.totalEncuestas,
      icon: ClipboardList,
      change: 'Historico de RIAS',
      changeType: 'neutral',
      color: 'indigo'
    },
    {
      title: 'Planes Pendientes',
      value: stats.planesPendientes,
      icon: Clock,
      change: 'Requieren atención',
      changeType: stats.planesPendientes > 0 ? 'negative' : 'neutral', 
      color: 'amber'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
