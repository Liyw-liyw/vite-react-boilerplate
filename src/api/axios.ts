import axios, { AxiosError } from 'axios';
import store from 'store2';

const apiBasePath = import.meta.env.VITE_API_BASE_URL;

interface ResponseData<D> {
  code: string;
  message: string;
  status: string;
  data: D;
}

interface ResponseError {
  code: string;
  message: string;
  status: string;
}

// 常见 jwt-auth
interface AuthTokenResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string;
  tokenType?: string;
}

const genAuthorization = () => {
  const authInfo = store.get('authInfo') as AuthTokenResponse;
  const Authorization =
    `${authInfo?.tokenType || ''} ${authInfo?.accessToken || ''}` || '';

  return Authorization;
};

const checkAuthToken = async () => {
  const authInfo = store.get('authInfo') as AuthTokenResponse;
  const refreshToken = authInfo?.refreshToken;

  try {
    if (refreshToken) {
      // 刷新token
      const res = await axios.post<unknown, ResponseData<AuthTokenResponse>>(
        `${apiBasePath}/user/refresh`,
        {
          refreshToken
        }
      );
      store.set('authInfo', { ...res.data, refreshTime: new Date().getTime() });
    } else {
      throw new Error('login expired!');
    }
  } catch (e) {
    /**
     * 提示登录过期
     * 清除authInfo
     * 调至登录页
     */
    store.remove('authInfo');
  }
};

const axiosInstance = axios.create({
  baseURL: apiBasePath,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.headers) {
      config.headers.Authorization = genAuthorization();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ResponseData<null>>) => {
    if (error.response?.status === 403) {
      await checkAuthToken();

      const Authorization = genAuthorization();
      return axiosInstance.request({
        ...error.config,
        headers: {
          ...error.config?.headers,
          Authorization
        }
      });
    }
    const errorMsg = error.response?.data;
    if (errorMsg) throw errorMsg;
    throw error;
  }
);

export default axiosInstance;
