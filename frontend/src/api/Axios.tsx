import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/constants";

const axiosInstanceWithAuth = axios.create({
  baseURL: BASE_URL,
});


/**
 * Helper function to obtain the current token of the user
 * @returns {String} The token of the current user
*/
const getToken = () => {
  const token = Cookies.get('token');
  if (token) return token;
  return '';
}

/**
 * Creating an Axios instance that is intercepted with an Auth header
 */


axiosInstanceWithAuth.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Creating an Axios instance for register and login. Has no Auth headers attached
 */
const axiosNoAuth = axios.create({
  baseURL: BASE_URL,
})

/**
 * To allow passing of tokens through cookies via requests
 */
axiosNoAuth.defaults.withCredentials = true;

export { axiosInstanceWithAuth, axiosNoAuth, getToken }