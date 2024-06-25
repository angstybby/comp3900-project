import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/constants";

const axiosInstanceWithAuth = axios.create({
  baseURL: BASE_URL,
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

const axiosNoAuth = axios.create({
  baseURL: BASE_URL,
})

axiosNoAuth.defaults.withCredentials = true;

export { axiosInstanceWithAuth, axiosNoAuth }