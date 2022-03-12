import axios, { AxiosRequestConfig } from 'axios';
import { options } from '../apis/apis';
import store from '../redux/store';
import { setAccountAddress, setConnected, setLoginResult } from '../redux/WalletReducer';
// import { logout } from '../services/auth-service';

const axiosInstance = axios.create({
  baseURL: `${options.baseUrl}`,
  timeout: Number(process.env.REACT_APP_TIMEOUT),
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  }
)

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      // localStorage.removeItem('account');
      // localStorage.removeItem('isConnected');
      // return
      // logout();
      // window.location.replace('/login');
    }
  }
);
export default axiosInstance;
