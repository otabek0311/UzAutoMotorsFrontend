import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { brandService } from '../../services/brandService';

function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    logo: null,
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await brandService.getAllBrands({ limit: 100 });
      setBrands(data.data);
    } catch (error) {
      console.error('Markalarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('country', formData.country);
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo);
    }

    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, formDataToSend);
        setSuccess('Marka muvaffaqiyatli yangilandi!');
      } else {
        await brandService.createBrand(formDataToSend);
        setSuccess('Marka muvaffaqiyatli qo\'shildi!');
      }
      loadBrands();
      setShowModal(false);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      country: brand.country || '',
      logo: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Markani o\'chirishni xohlaysizmi?')) return;

    try {
      await brandService.deleteBrand(id);
      setSuccess('Marka muvaffaqiyatli o\'chirildi!');
      loadBrands();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      country: '',
      logo: null,
    });
    setEditingBrand(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Markalar</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Marka qo'shish
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
              {brand.country && (
                <p className="text-gray-600 text-sm mb-2">{brand.country}</p>
              )}
              {brand.description && (
                <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                  {brand.description}
                </p>
              )}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleEdit(brand)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  <Pencil className="w-4 h-4" />
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingBrand ? 'Markani tahrirlash' : 'Yangi marka qo\'shish'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka nomi *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mamlakat
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ta'rif
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo {!editingBrand && '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input-field"
                    required={!editingBrand}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    {editingBrand ? 'Yangilash' : 'Qo\'shish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBrands;
