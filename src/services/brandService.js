import api from '../utils/api';

export const brandService = {
  getAllBrands: async (params) => {
    const response = await api.get('/brands', { params });
    return response.data;
  },

  getBrandById: async (id) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  createBrand: async (formData) => {
    const response = await api.post('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateBrand: async (id, formData) => {
    const response = await api.put(`/brands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};
