import api from '../utils/api';
import Cookies from 'js-cookie';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.success) {
      Cookies.set('AccessToken', response.data.data.accessToken, { expires: 1/96 });
      Cookies.set('RefreshToken', response.data.data.refreshToken, { expires: 15 });
    }
    return response.data;
  },

  logout: () => {
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!Cookies.get('AccessToken');
  },
};
