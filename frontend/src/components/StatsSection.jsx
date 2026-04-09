import React from 'react';
import { Users, ClipboardCheck, AlertTriangle, HeartPulse } from 'lucide-react';
import StatCard from './StatCard';

const statsData = [
  {
    title: 'Total Pacientes',
    value: '1,248',
    icon: Users,
    color: 'blue'
  },
  {
    title: 'Encuestas Hoy',
    value: '42',
    icon: ClipboardCheck,
    color: 'green'
  },
  {
    title: 'Alto Riesgo',
    value: '18',
    icon: AlertTriangle,
    color: 'red'
  },
  {
    title: 'Planes Pendientes',
    value: '35',
    icon: HeartPulse,
    color: 'purple'
  }
];

const StatsSection = () => {
  return (
    // Componente de Grid de Tailwind CSS:
    // Por defecto (móvil) ocupa 1 columna: grid-cols-1
    // En pantallas pequeñas/medianas (sm): grid-cols-2 (2 columnas)
    // En pantallas extra grandes (xl): grid-cols-4 (4 columnas en línea)
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsSection;
