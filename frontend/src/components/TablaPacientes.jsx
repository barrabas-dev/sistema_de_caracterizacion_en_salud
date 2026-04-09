import React from 'react';

const mockPacientes = [
  { id: 1, nombre: 'Juan Pérez', edad: 45, diagnostico: 'Hipertensión', riesgo: 'Alto', fecha: '2023-10-25' },
  { id: 2, nombre: 'Ana Gómez', edad: 32, diagnostico: 'Control General', riesgo: 'Bajo', fecha: '2023-10-24' },
  { id: 3, nombre: 'Carlos Ruiz', edad: 58, diagnostico: 'Diabetes Tipo 2', riesgo: 'Medio', fecha: '2023-10-24' },
  { id: 4, nombre: 'María López', edad: 29, diagnostico: 'Embarazo', riesgo: 'Bajo', fecha: '2023-10-23' },
  { id: 5, nombre: 'Luis Torres', edad: 71, diagnostico: 'Insuficiencia Cardíaca', riesgo: 'Alto', fecha: '2023-10-22' },
];

const getBadgeColor = (riesgo) => {
  switch (riesgo) {
    case 'Alto':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Medio':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Bajo':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TablaPacientes = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Pacientes Recientes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-3 font-medium">Nombre</th>
              <th className="px-6 py-3 font-medium">Edad</th>
              <th className="px-6 py-3 font-medium">Diagnóstico</th>
              <th className="px-6 py-3 font-medium">Nivel de Riesgo</th>
              <th className="px-6 py-3 font-medium">Fecha Ingreso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockPacientes.map((paciente) => (
              <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {paciente.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paciente.edad} años
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {paciente.diagnostico}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border ${getBadgeColor(paciente.riesgo)}`}>
                    {paciente.riesgo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {paciente.fecha}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaPacientes;
