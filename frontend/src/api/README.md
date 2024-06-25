## This README is a tutorial on using Axios

Call the axios instance defined in `Axios.tsx`. Note that the root directory is already set up. Just define the port you want to access. 

NOTE: If you ever need to request something that does not require the token (ie. register) just simply put `axios.post()`.

The axios instance, `axiosInstanceWithAuth`, by default was setup to include authentication since users MUST log in to be able to do anything. Tokens are obtained by calling `Cookies.get("token")`, tokens are set via the backend.

Methods are specified by using `.` 
Just add `.get`, `.post`, etc.

Example: `axiosInstanceWithAuth.get(insert_code_here)`

Axios Docs: https://axios-http.com/docs/api_intro 