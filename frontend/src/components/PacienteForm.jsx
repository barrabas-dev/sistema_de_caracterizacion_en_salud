import { useState } from 'react';
import { Save, UserPlus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api'; // Importamos tu instancia de Axios configurada con JWT

export default function PacienteForm({ onCancel, onSuccess }) {
  // 1. Estado inicial mapeado EXACTAMENTE a tu modelo Django
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_id: 'CC', // Default según tu modelo
    numero_id: '',
    sexo: '', // Cambiado de 'genero' a 'sexo'
    edad: '',
    eps: '',
    telefono: '',
    direccion: ''
  });

  // Estados para manejar la UI de la petición
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // 2. Petición POST al endpoint de Django (asumiendo la ruta 'pacientes/')
      const response = await api.post('pacientes/', formData);
      
      console.log('Paciente creado:', response.data);
      setStatus('success');
      
      // Limpiar el formulario o avisar al componente padre después de un instante
      setTimeout(() => {
        if (onSuccess) onSuccess(); // Función opcional para recargar la tabla
        if (onCancel) onCancel();   // Cerramos el formulario
      }, 1500);

    } catch (error) {
      setStatus('error');
      // Manejo de errores específicos de DRF (ej. numero_id duplicado)
      if (error.response && error.response.data) {
        const errors = error.response.data;
        // Si el error es por el unique=True de numero_id
        if (errors.numero_id) {
          setErrorMessage('Este número de documento ya está registrado en el sistema.');
        } else {
          setErrorMessage('Error al guardar los datos. Revisa los campos obligatorios.');
        }
      } else {
        setErrorMessage('Error de conexión con el servidor.');
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-600">
          <UserPlus size={24} />
          <h2 className="text-lg font-semibold text-slate-800">Registrar Nuevo Paciente</h2>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Alertas de Éxito o Error */}
      {status === 'success' && (
        <div className="m-6 mb-0 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle2 size={20} />
          <p className="font-medium">Paciente registrado correctamente.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="m-6 mb-0 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required maxLength="200"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Ej. María Antonia González" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento *</label>
            <select name="tipo_id" value={formData.tipo_id} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white outline-none">
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="RC">Registro Civil</option>
              <option value="CE">Cédula de Extranjería</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número de Documento *</label>
            <input type="text" name="numero_id" value={formData.numero_id} onChange={handleChange} required maxLength="20"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Sin puntos ni espacios" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sexo Biológico *</label>
            <select name="sexo" value={formData.sexo} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white outline-none">
              <option value="">Seleccione...</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Edad *</label>
            <input type="number" name="edad" value={formData.edad} onChange={handleChange} required min="0" max="120"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Años cumplidos" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">EPS</label>
            <input type="text" name="eps" value={formData.eps} onChange={handleChange} maxLength="100"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Opcional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} maxLength="15"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Opcional" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección de Residencia</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Opcional" />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
          <button type="button" onClick={onCancel} disabled={status === 'loading'}
            className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          
          <button type="submit" disabled={status === 'loading' || status === 'success'}
            className="px-6 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70">
            {status === 'loading' ? (
              <span>Guardando...</span>
            ) : (
              <>
                <Save size={18} />
                Guardar Paciente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
