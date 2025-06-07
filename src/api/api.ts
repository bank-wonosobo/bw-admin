import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const apiV1 = axios.create({
  baseURL: `${baseURL}/admin`,
});

export const apiV1na = axios.create({
  baseURL: `${baseURL}`,
});

// apiV1.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
