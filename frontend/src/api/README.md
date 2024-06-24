## This README is a tutorial on using Axios

Call the axios instance defined in `Axios.tsx`. Note that the root directory is already set up. Just define the port you want to access. 

The axios instance by default was setup to include authentication since users MUST log in to be able to do anything. Tokens are obtained by calling `Cookies.get("token")`.

Methods are specified by using `.`. 

Example: `axiosInstance.get(insert_code_here)`

Axios Docs: https://axios-http.com/docs/api_intro 