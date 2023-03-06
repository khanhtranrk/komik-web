import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, isAxiosError, RawAxiosRequestHeaders } from "axios";
import { setUserTokens, eraseUserTokens, setIsRefreshing } from "@redux/sessionSlice";
import store from "@redux/store";
import * as SessionService from './SessionService';

interface ResponseData {
  status: string;
  message: string;
  data?: any;
  error?: any;
}

class ApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiBaseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: apiBaseURL || process.env.API_BASE_URL,
      headers: {
        'Content-type': 'application/json'
      }
    });

    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const userTokens = store.getState().session.userTokens;
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${userTokens.access_token}`,
        };
        return config;
      },
      (error: AxiosError) => {
        console.log(`[API] ${error.config?.method} ${error.config?.url} [Error]`);

        return Promise.reject(error);
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        console.log(`[API] ${response.config.method} ${response.config.url} [${response.status}]`);

        return Promise.resolve(response);
      },
      async (error: AxiosError<ResponseData>) => {
        console.log(`[API] ${error.config?.method} ${error.config?.url} [${error.response?.status}]`);

        if (error.response && error.response.status === 401 && !store.getState().session.isRefreshing) {
          // fetch tokens
          try {
            store.dispatch(setIsRefreshing(true));
            let tokens = await SessionService.refreshTokensAsync(store.getState().session.userTokens);
            store.dispatch(setUserTokens(tokens));
          } catch(error) {
            if (isAxiosError(error) && error.response?.status == 422) {
              store.dispatch(eraseUserTokens());
            } 

            return Promise.reject(error);
          } finally {
            store.dispatch(setIsRefreshing(false));
          }

          if (error.config) {
            return axios.request(error.config);
          }
        }

        // Debug
        if (error.response) {
          console.log(error.response.data.message);
        } else {
          console.log(error.message);
        }

        return Promise.reject(error);
      }
    )
  }

  public async get(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get<ResponseData>(url, config);
    return response.data.data;
  }

  public async post(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.post<ResponseData>(url, data, config);
    return response.data.data;
  }

  public async put(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.put<ResponseData>(url, data, config);
    return response.data.data;
  }

  public async delete(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.delete<ResponseData>(url, config);
    return response.data.data;
  }
}

export default new ApiService();
