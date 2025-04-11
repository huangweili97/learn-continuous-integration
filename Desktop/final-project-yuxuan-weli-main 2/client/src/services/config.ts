/**
 * This file contains the configuration for the axios instance that will be used to make requests to the API.
 * 
 * The configuration includes the base URL for the API and the interceptors that will be used to handle the requests and responses.
 */

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Base URL for the REST API of the server.
// In development, this will be proxied through the React development server
const REACT_APP_API_URL = process.env.NODE_ENV === 'development' 
  ? ''  // Empty string will use the proxy
  : "https://localhost:8000";

/**
 * The handler function handles the response from the server by simply returning the response.
 * @param res an AxiosResponse object
 * @returns an AxiosResponse object
 */
const handleRes = (res: AxiosResponse): AxiosResponse => {
  return res;
};

/**
 * The handler function handles the error by logging it to the console and returning a rejected promise with the error object.
 * @param err an AxiosError object
 * @returns a rejected promise with the error object
 */
const handleErr = (err: AxiosError): Promise<never> => {
  console.error('API Error:', err);
  return Promise.reject(err);
};

/**
 * The axios instance that will be used to make requests to the API.
 * 
 * The instance is created with the withCredentials option set to true, which allows the client to send cookies with the request to cross site servers.
 */
const api = axios.create({ 
  baseURL: REACT_APP_API_URL,
  withCredentials: true
});

/**
 * The interceptor handles all outgoing requests.
 * 
 * Every request made with the api instance will be passed through the request interceptor, which will log the request to the console and return the request object.
 * It also adds the authentication token to the request if it exists in localStorage.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    console.log('Making request to:', config.url);
    
    // Add authentication token if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError): Promise<never> => handleErr(error)
);

/**
 * The interceptor handles all incoming responses.
 * 
 * Every response received from the server will be passed through the response interceptor, which will handle the response using the handleRes function and the handleErr function.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => handleRes(response),
  (error: AxiosError): Promise<never> => handleErr(error)
);

export { REACT_APP_API_URL, api };
