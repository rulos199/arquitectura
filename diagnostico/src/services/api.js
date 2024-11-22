import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

export const login = (username, password) => {
  return axios.post(API_URL + 'users/login', { username, password });
};

export const registerPatient = (user) => {
  return axios.post(API_URL + 'users/register/patient', user);
};

export const registerDoctor = (user) => {
  return axios.post(API_URL + 'users/register/doctor', user);
};

export const getActiveDoctors = () => {
  return axios.get(API_URL + 'doctors');
};

export const getMedicamentos = (patientId) => {
  return axios.get(API_URL + `medicamentos/${patientId}`);
};

export const getHistoriaClinica = (patientId) => {
  return axios.get(API_URL + `historia/${patientId}`);
};

