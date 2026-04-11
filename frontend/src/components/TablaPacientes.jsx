import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, ClipboardPlus, Loader2, UserPlus } from 'lucide-react';
import api from '../services/api';

export default function TablaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesRes, encuestasRes] = await Promise.all([
          api.get('pacientes/'),
          api.get('encuestas/')
        ]);

        const pacs = pacientesRes.data.results || pacientesRes.data;
        const encs = encuestasRes.data.results || encuestasRes.data;

        const dataEnriquecida = pacs
          .sort((a, b) => b.id - a.id) // Los más recientes primero
          .slice(0, 5) // Máximo 5 registros
          .map(pac => {
            const encuestasPaciente = encs.filter(e => e.paciente === pac.id);
            
            let estadoPAE = "Sin Encuesta";
            if (encuestasPaciente.length > 0) {
              const tienePlan = encuestasPaciente.some(e => e.tiene_plan);
              estadoPAE = tienePlan ? "Plan Generado" : "Plan Pendiente";
            }
            
            return { ...pac, estadoPAE };
          });

        setPacientes(dataEnriquecida);
      } catch (error) {
        console.error("Error al cargar pacientes y encuestas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para devolver estilos dinámicos de Tailwind en base al estado
  const getBadgeStyle = (estado) => {
    switch(estado) {
      case "Plan Generado":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Plan Pendiente":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default: // "Sin Encuesta"
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 bg-white rounded-xl border border-slate-200">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden transition-colors">
      
      {/* Encabezado */}
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 transition-colors">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <UserPlus size={20} className="text-indigo-600" />
          Últimos Pacientes Registrados
        </h2>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200 transition-colors">
              <th className="px-6 py-4 font-medium">Paciente</th>
              <th className="px-6 py-4 font-medium">Documento</th>
              <th className="px-6 py-4 font-medium">Edad / Sexo</th>
              <th className="px-6 py-4 font-medium">EPS</th>
              <th className="px-6 py-4 font-medium">Estado PAE</th>
              <th className="px-6 py-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No hay pacientes registrados en el sistema.
                </td>
              </tr>
            ) : (
              pacientes.map((paciente) => (
                <tr key={paciente.id} className="bg-white hover:bg-slate-50 transition-colors">
                  
                  {/* Columna Paciente */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 block transition-colors">{paciente.nombre}</span>
                    <span className="text-xs text-slate-500 transition-colors">ID: {paciente.id}</span>
                  </td>
                  
                  {/* Columna Documento */}
                  <td className="px-6 py-4 text-slate-700 transition-colors">
                    {paciente.tipo_id_display || paciente.tipo_id || 'CC'} {paciente.numero_id}
                  </td>
                  
                  {/* Columna Edad / Sexo */}
                  <td className="px-6 py-4 text-slate-700 transition-colors">
                    {paciente.edad} años / {paciente.sexo}
                  </td>
                  
                  {/* Columna EPS */}
                  <td className="px-6 py-4 text-slate-700 transition-colors">
                    {paciente.eps || 'N/R'}
                  </td>
                  
                  {/* Columna Estado PAE (Badges) */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${getBadgeStyle(paciente.estadoPAE)}`}>
                      {paciente.estadoPAE}
                    </span>
                  </td>
                  
                  {/* Columna Acciones */}
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button 
                      onClick={() => navigate('/encuestas/nueva', { state: { pacienteId: paciente.id } })}
                      title="Generar Encuesta para este paciente" 
                      className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <ClipboardPlus size={16} />
                    </button>
                    <button 
                      title="Editar Paciente" 
                      className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
