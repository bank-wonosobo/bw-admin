import axios from "axios";
import Cookies from "js-cookie";

const rawBaseURL = process.env.NEXT_PUBLIC_API_URL?.trim() || "";
const baseURLauth = process.env.NEXT_PUBLIC_AUTH_API_URL;

function createPublicationBaseURL(baseURL: string) {
  if (!baseURL) return "";

  const normalizedBaseURL = baseURL.replace(/\/+$/, "");

  if (
    normalizedBaseURL.endsWith("/api/v1") ||
    normalizedBaseURL.endsWith("/publication")
  ) {
    return normalizedBaseURL;
  }

  return `${normalizedBaseURL}/api/v1`;
}

const baseURL = createPublicationBaseURL(rawBaseURL);

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

// apiV1na.interceptors.request.use(
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
