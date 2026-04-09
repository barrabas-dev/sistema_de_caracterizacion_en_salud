// src/services/surveyService.js

// 1. Importamos tu cliente Axios configurado (tu api.js)
import api from './api';

// 2. Creamos las funciones específicas para este módulo

export const getPacientes = async () => {
    // Al usar "api.get", Axios pasa automáticamente por tus interceptores,
    // le pone el token y hace la petición a 'http://localhost:8000/api/pacientes/'
    const response = await api.get('pacientes/');
    return response.data;
};

export const createEncuesta = async (encuestaData) => {
    const response = await api.post('encuestas/', encuestaData);
    return response.data;
};