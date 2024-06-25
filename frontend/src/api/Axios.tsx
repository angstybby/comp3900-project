import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/constants";

const axiosInstanceWithAuth = axios.create({
  baseURL: BASE_URL,
});

// Obtain the token
const getToken = () => {
  return Cookies.get('token');
}

axiosInstanceWithAuth.interceptors.request.use((config) => {
  const token = getToken();
  console.log(token)
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});



const axiosNoAuth = axios.create({
  baseURL: BASE_URL,
})

axiosNoAuth.defaults.withCredentials = true;

export { axiosInstanceWithAuth, axiosNoAuth }