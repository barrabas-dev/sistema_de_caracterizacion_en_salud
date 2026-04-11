import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, FileText, Activity, User, HeartPulse } from 'lucide-react';
import api from '../services/api';

export default function PlanDocumento() {
  const { id } = useParams(); // ID de la encuesta
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocumento = async () => {
      try {
        // Al consultar la encuesta, Django nos trae paciente + encuesta + plan_detalle
        const response = await api.get(`encuestas/${id}/`);
        setDatos(response.data);
      } catch (err) {
        setError("Error al cargar el documento.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocumento();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando documento clínico...</div>;
  if (error || !datos) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      
      {/* Botones de Acción (Se ocultan al imprimir con 'print:hidden') */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft size={20} /> Volver al Panel
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
          <Printer size={18} /> Imprimir PAE
        </button>
      </div>

      {/* HOJA DEL DOCUMENTO */}
      <div className="max-w-4xl mx-auto bg-white shadow-md border border-slate-200 p-8 md:p-12 print:shadow-none print:border-none print:p-0">
        
        {/* Encabezado Institucional */}
        <div className="border-b-2 border-slate-800 pb-6 mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">Plan de Atención de Enfermería (PAE)</h1>
          <p className="text-slate-500 mt-1">Sistema de Caracterización en Salud</p>
          <p className="text-sm text-slate-400 mt-2">Documento N° {datos.id} | Fecha: {datos.fecha_recoleccion}</p>
        </div>

        {/* 1. Datos del Paciente */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="text-indigo-600" size={20}/> 1. Identificación del Paciente
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="font-semibold block text-slate-500">Nombre Completo:</span> {datos.paciente_nombre}</div>
            <div><span className="font-semibold block text-slate-500">Documento:</span> {datos.paciente_documento}</div>
            <div><span className="font-semibold block text-slate-500">Edad:</span> {datos.paciente_edad} años</div>
            <div><span className="font-semibold block text-slate-500">Sexo / EPS:</span> {datos.paciente_sexo} - {datos.paciente_eps || 'N/A'}</div>
          </div>
        </section>

        {/* 2. Resultados Físicos */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Activity className="text-indigo-600" size={20}/> 2. Medidas Antropométricas
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
            <div><span className="font-semibold">Peso:</span> {datos.peso_kg ? `${datos.peso_kg} kg` : 'No registrado'}</div>
            <div><span className="font-semibold">Talla:</span> {datos.talla_cm ? `${datos.talla_cm} cm` : 'No registrado'}</div>
            <div><span className="font-semibold">Tensión Arterial:</span> {datos.tension_arterial || 'No registrado'}</div>
          </div>
        </section>

        {/* 3. Plan de Cuidado Generado */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartPulse className="text-rose-600" size={20}/> 3. Resultados y Plan de Cuidado
          </h2>
          
          {!datos.plan_detalle ? (
            <p className="text-slate-500 italic">El plan de cuidado aún no ha sido generado para este paciente.</p>
          ) : (
            <div className="space-y-6 text-sm text-slate-700">
              <div className="border-l-4 border-rose-500 pl-4">
                <h3 className="font-bold text-slate-900 mb-1">Situaciones Encontradas (Análisis RIAS)</h3>
                <p className="whitespace-pre-wrap">{datos.plan_detalle.situaciones}</p>
              </div>
              
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="font-bold text-slate-900 mb-1">Prioridad para la Salud</h3>
                <p className="whitespace-pre-wrap">{datos.plan_detalle.prioridad}</p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-bold text-slate-900 mb-1">Acciones e Intervenciones Sugeridas</h3>
                <p className="whitespace-pre-wrap">{datos.plan_detalle.intervenciones}</p>
              </div>

              <div className="border-l-4 border-sky-500 pl-4">
                <h3 className="font-bold text-slate-900 mb-1">Actividades para el Logro</h3>
                <p className="whitespace-pre-wrap">{datos.plan_detalle.actividades}</p>
              </div>
            </div>
          )}
        </section>

        {/* Firmas */}
        <div className="mt-20 pt-8 flex justify-around text-center text-sm text-slate-500 print:mt-32">
          <div>
            <div className="w-48 border-t border-slate-400 mx-auto mb-2"></div>
            Firma Enfermero/a
          </div>
          <div>
            <div className="w-48 border-t border-slate-400 mx-auto mb-2"></div>
            Firma Paciente
          </div>
        </div>

      </div>
    </div>
  );
}
