import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  // Mapa de colores (colorMap) usando clases de Tailwind CSS nativas.
  // Es necesario mapearlas completas para que Tailwind las detecte y las incluya en el build de producción.
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const colorClass = colorMap[color] || colorMap.blue;

  return (
    // Contenedor principal de la tarjeta: fondo blanco, bordes redondeados, sombra sutil, flexbox para alinear el icono al lado de los textos.
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 transition-all hover:shadow-md">
      {/* Contenedor del ícono con color dinámico */}
      <div className={`p-3 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Contenedor para el título y el valor estadístico */}
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
