import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const baseURLauth = process.env.NEXT_PUBLIC_AUTH_API_URL;

export const apiV1 = axios.create({
  baseURL: `${baseURL}/admin`,
});

export const apiV1user = axios.create({
  baseURL: `${baseURLauth}/users`,
});

export const apiV1na = axios.create({
  baseURL: `${baseURL}`,
});

export function setAuthToken(token: string) {
  Cookies.set("token", token);
}

export function removeAuthToken() {
  Cookies.remove("token");
}

apiV1.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiV1user.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiV1na.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
