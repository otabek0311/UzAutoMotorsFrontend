import api from '../utils/api';

export const carService = {
  getAllCars: async (params) => {
    const response = await api.get('/cars', { params });
    return response.data;
  },

  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  getPopularCars: async (limit = 8) => {
    const response = await api.get('/cars/popular', { params: { limit } });
    return response.data;
  },

  getLatestCars: async (limit = 8) => {
    const response = await api.get('/cars/latest', { params: { limit } });
    return response.data;
  },

  createCar: async (formData) => {
    const response = await api.post('/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCar: async (id, formData) => {
    const response = await api.put(`/cars/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },
};
