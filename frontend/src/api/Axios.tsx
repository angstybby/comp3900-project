import axios from "axios";
import Cookies from "js-cookie";

const axiosInstanceWithAuth = axios.create({
  baseURL: 'https://localhost:5005',
});

axiosInstanceWithAuth.interceptors.request.use((config) => {
  const token = getToken();
  console.log(token)
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Obtain the token
const getToken = () => {
  return Cookies.get('token');
}

export { axiosInstanceWithAuth }