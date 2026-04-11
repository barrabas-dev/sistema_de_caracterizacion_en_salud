import { useState, useEffect } from 'react';
import { ClipboardList, Edit2, Trash2, Wand2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function DashboardEncuestas() {
  const [encuestas, setEncuestas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar encuestas desde Django
  const fetchEncuestas = async () => {
    try {
      const response = await api.get('encuestas/');
      // Manejar estructura paginada o directa de DRF
      setEncuestas(response.data.results || response.data);
    } catch (error) {
      console.error("Error cargando encuestas", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEncuestas();
  }, []);

  // Eliminar Encuesta (Y por cascada, el plan)
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta encuesta? Se borrará permanentemente su Plan de Cuidado asociado.")) {
      try {
        await api.delete(`encuestas/${id}/`);
        setEncuestas(encuestas.filter(e => e.id !== id));
      } catch (error) {
        alert("Error al eliminar la encuesta.");
      }
    }
  };

  // Generar Plan Placeholder
  const handleGenerarPlan = async (encuestaId) => {
    try {
      await api.post(`encuestas/${encuestaId}/generar_plan/`);
      alert("¡Plan de Cuidado generado exitosamente!");
      fetchEncuestas(); // Recargamos para actualizar el estado del botón a "Plan Generado"
    } catch (error) {
      alert(error.response?.data?.detail || "Error al generar el plan.");
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500 font-medium animate-pulse">Cargando módulo de encuestas...</div>;

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
      
      {/* Header del panel */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <ClipboardList size={20} className="text-indigo-600" />
          Gestión de Encuestas y PAE
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-4 font-medium">ID / Fecha</th>
              <th className="px-6 py-4 font-medium">Paciente</th>
              <th className="px-6 py-4 font-medium">Estado del Plan</th>
              <th className="px-6 py-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {encuestas.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  <AlertCircle className="mx-auto mb-3 text-slate-400" size={32} />
                  <p>No hay encuestas registradas en el sistema.</p>
                </td>
              </tr>
            ) : (
              encuestas.map((encuesta) => (
                <tr key={encuesta.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Columna Fecha */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 block">Encuesta #{encuesta.id}</span>
                    <span className="text-xs text-slate-500">{encuesta.fecha_recoleccion}</span>
                  </td>
                  
                  {/* Columna Paciente (Usando los campos del serializador) */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700 block">{encuesta.paciente_nombre}</span>
                    <span className="text-xs text-slate-500">Doc: {encuesta.paciente_documento}</span>
                  </td>
                  
                  {/* Columna Estado */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border
                      ${encuesta.tiene_plan ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {encuesta.tiene_plan ? 'Plan Generado' : 'Sin Plan'}
                    </span>
                  </td>
                  
                  {/* Columna Acciones */}
                  <td className="px-6 py-4 flex justify-center gap-2">
                    {/* Botón Mágico: Generar Plan */}
                    <button 
                      onClick={() => handleGenerarPlan(encuesta.id)}
                      disabled={encuesta.tiene_plan}
                      title={encuesta.tiene_plan ? "El plan ya existe" : "Generar Plan de Cuidado"} 
                      className={`p-2 rounded-lg transition-all ${
                        encuesta.tiene_plan 
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                          : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                      }`}>
                      <Wand2 size={16} />
                    </button>

                    <button title="Editar Encuesta" className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    
                    <button onClick={() => handleDelete(encuesta.id)} title="Eliminar Encuesta y Plan" className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
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
