import axios from 'axios';

const API_URL = 'http://localhost:5000/api/'; // Asegúrate de que el puerto y la ruta sean correctos

export const login = (username, password) => {
  return axios.post(API_URL + 'users/login', { username, password });
};

export const registerPatient = (user) => {
  return axios.post(API_URL + 'users/register/patient', user);
};

export const registerDoctor = (user) => {
  return axios.post(API_URL + 'users/register/doctor', user);
};