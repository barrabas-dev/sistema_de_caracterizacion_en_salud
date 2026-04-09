import { useState, useEffect } from 'react';
import { ClipboardList, Activity, Save, X, AlertCircle, CheckCircle2, HeartPulse } from 'lucide-react';
import api from '../services/api';

export default function EncuestaForm({ onCancel, onSuccess }) {
  // 1. Estado para almacenar los pacientes que vienen de Django
  const [pacientes, setPacientes] = useState([]);
  
  // 2. Estado del formulario (Mapeado exacto al modelo de Django)
  const [formData, setFormData] = useState({
    paciente: '', // Django DRF espera el ID en el campo con el nombre de la FK
    fecha_recoleccion: new Date().toISOString().split('T')[0], // Fecha actual por defecto YYYY-MM-DD
    peso_kg: '',
    talla_cm: '',
    tension_arterial: '',
    // Módulo RIAS (Booleanos)
    citologia_adn_vph: false,
    mamografia_ecm: false,
    tamizaje_ca_colon: false,
    tamizaje_ca_prostata: false,
    desparasitacion_antihelmintica: false,
    planificacion_familiar: false,
    tamizaje_anemia: false,
    tamizaje_riesgo_cardiovascular: false,
    vacunacion: false,
    valoracion_odontologia: false,
    consulta_control_rias: false,
    laboratorios_rias: false,
    tamizaje_its: false,
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // 3. Obtener la lista de pacientes al cargar el componente
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get('pacientes/');
        // Asegúrate de que response.data sea un array (depende de si tienes paginación en DRF)
        const data = response.data.results ? response.data.results : response.data;
        setPacientes(data);
      } catch (error) {
        console.error("Error cargando pacientes:", error);
        setErrorMessage("No se pudieron cargar los pacientes. Verifica tu conexión.");
      }
    };
    fetchPacientes();
  }, []);

  // 4. Manejador de cambios inteligente (Texto vs Checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 5. Envío de datos a Django
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Preparamos los datos. Convertimos strings vacíos de números a null para que Django no falle
    const dataToSend = { ...formData };
    if (dataToSend.peso_kg === '') dataToSend.peso_kg = null;
    if (dataToSend.talla_cm === '') dataToSend.talla_cm = null;

    try {
      // Petición POST al endpoint de encuestas
      await api.post('encuestas/', dataToSend);
      setStatus('success');
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onCancel) onCancel();
      }, 1500);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Error al guardar la encuesta. Verifica los datos.');
      console.error(error.response?.data);
    }
  };

  // Array auxiliar para renderizar los checkboxes más fácil
  const riasCheckboxes = [
    { name: 'citologia_adn_vph', label: 'Citología - ADN VPH' },
    { name: 'mamografia_ecm', label: 'Mamografía - ECM' },
    { name: 'tamizaje_ca_colon', label: 'Tamizaje CA Colon' },
    { name: 'tamizaje_ca_prostata', label: 'Tamizaje CA Próstata' },
    { name: 'desparasitacion_antihelmintica', label: 'Desparasitación' },
    { name: 'planificacion_familiar', label: 'Planificación Familiar' },
    { name: 'tamizaje_anemia', label: 'Tamizaje Anemia' },
    { name: 'tamizaje_riesgo_cardiovascular', label: 'Riesgo Cardiovascular' },
    { name: 'vacunacion', label: 'Esquema Vacunación' },
    { name: 'valoracion_odontologia', label: 'Odontología al día' },
    { name: 'consulta_control_rias', label: 'Consulta Control (RIAS)' },
    { name: 'laboratorios_rias', label: 'Laboratorios RIA' },
    { name: 'tamizaje_its', label: 'Tamizaje ITS' },
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto">
      
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <ClipboardList size={24} />
          <h2 className="text-lg font-semibold text-slate-800">Nueva Encuesta de Salud</h2>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      {status === 'success' && (
        <div className="m-6 mb-0 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle2 size={20} />
          <p className="font-medium">Encuesta guardada correctamente.</p>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="m-6 mb-0 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* SECCIÓN 1: Selección de Paciente y Fecha */}
        <div className="bg-indigo-50/50 p-5 rounded-lg border border-indigo-100 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Paciente *</label>
            <select name="paciente" value={formData.paciente} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white outline-none">
              <option value="">Seleccione un paciente registrado...</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (ID: {p.numero_id})</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Recolección</label>
            <input type="date" name="fecha_recoleccion" value={formData.fecha_recoleccion} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        {/* SECCIÓN 2: Datos Físicos (Se muestra solo si hay paciente seleccionado) */}
        <div className={`transition-opacity duration-300 ${!formData.paciente ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-md font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Activity size={18} className="text-indigo-500" />
            Datos Físicos Generales (Opcionales)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
              <input type="number" step="0.01" name="peso_kg" value={formData.peso_kg} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. 70.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Talla (cm)</label>
              <input type="number" name="talla_cm" value={formData.talla_cm} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. 175" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tensión Arterial</label>
              <input type="text" name="tension_arterial" value={formData.tension_arterial} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. 120/80" />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: Tamizajes RIAS */}
        <div className={`transition-opacity duration-300 ${!formData.paciente ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-md font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
            <HeartPulse size={18} className="text-rose-500" />
            Valoración y Tamizajes (RIAS)
          </h3>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riasCheckboxes.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id={item.name} 
                      name={item.name} 
                      type="checkbox" 
                      checked={formData[item.name]} 
                      onChange={handleChange}
                      className="w-5 h-5 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={item.name} className="font-medium text-slate-700 cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
          <button type="button" onClick={onCancel} disabled={status === 'loading'}
            className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          
          <button type="submit" disabled={status === 'loading' || status === 'success' || !formData.paciente}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70">
            {status === 'loading' ? 'Guardando...' : (
              <><Save size={18} /> Guardar Encuesta</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
