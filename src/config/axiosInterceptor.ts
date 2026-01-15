import axios from 'axios';
import { store } from '../redux/store';
import { refreshToken } from '../redux/slices/authSlice/authSlice';

axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const state = store.getState();
      if (state.auth.refreshToken) {
        try {
          const result = await store.dispatch(refreshToken()).unwrap();
          // Retry the request with new token
          const newConfig = {
            ...error.config,
            headers: {
              ...error.config.headers,
              Authorization: `Bearer ${result.data.accessToken}`,
            },
          };
          return axios(newConfig);
        } catch {
          // Refresh failed, logout and redirect
          store.dispatch({ type: 'auth/logout' });
          window.location.href = '/';
          return Promise.reject(error);
        }
      } else {
        // No refresh token, logout and redirect
        store.dispatch({ type: 'auth/logout' });
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);