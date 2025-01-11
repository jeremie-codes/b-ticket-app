import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";

import { API_CSRF_URL, API_URL } from "@env";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  withCredentials: true,
});

const REQUEST_RETRY_TIMES = 3;

axiosRetry(axiosInstance, {
  retries: REQUEST_RETRY_TIMES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    console.log("error", error);
    return (
      (error.code !== "ECONNABORTED" &&
        (!error.response ||
          (error.response.status >= 500 && error.response.status <= 599) ||
          error.response.status === 0)) ||
      error.code === "ECONNREFUSED"
    );
  },
  shouldResetTimeout: true,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject("Erreur --> " + error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.log("error", err);
    if (!err.response) {
      if (err.code === "ECONNABORTED") {
        return {
          data: {
            success: false,
            message:
              "Il est impossible de se connecter au serveur. Veuillez vérifier que vous avez accès à internet.",
            errors: [],
          },
        };
      }

      return {
        data: {
          success: false,
          message:
            "Il est impossible de se connecter au serveur. Veuillez vérifier que vous avez accès à internet.",
          errors: [],
        },
      };
    }

    if (!err) {
      return {
        data: {
          success: false,
          message:
            "Une erreur s'est survenue lors de l'opération. Veuillez réessayer plus tard, s'il vous plaît.",
          errors: [],
        },
      };
    }
    return err.response;
  }
);

const post = async (
  url: string,
  data?: [] | {},
  config?: AxiosRequestConfig
) => {
  // await axios.get(API_CSRF_URL);
  return await axiosInstance.post(url, data, config);
};

const put = async (url: string, data: [] | {}, config?: AxiosRequestConfig) => {
  await axios.get(API_CSRF_URL);
  return await axiosInstance.put(url, data, config);
};

const patch = async (
  url: string,
  data: [] | {},
  config?: AxiosRequestConfig
) => {
  await axios.get(API_CSRF_URL);
  return await axiosInstance.patch(url, data, config);
};

const _delete = async (url: string, config?: AxiosRequestConfig) => {
  await axios.get(API_CSRF_URL);
  return await axiosInstance.delete(url, config);
};

const methods = {
  get: axiosInstance.get,
  post,
  put,
  patch,
  delete: _delete,
  axiosInstance,
};

export default methods;
