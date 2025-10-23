import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Plus, X } from 'lucide-react';
import { carService } from '../../services/carService';
import { brandService } from '../../services/brandService';

function AdminCarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    color: '',
    fuelType: 'benzin',
    transmission: 'mexanika',
    engineCapacity: '',
    mileage: 0,
    description: '',
    isAvailable: true,
  });
  const [features, setFeatures] = useState(['']);
  const [exteriorImages, setExteriorImages] = useState([]);
  const [interiorImages, setInteriorImages] = useState([]);

  useEffect(() => {
    loadBrands();
    if (isEdit) {
      loadCar();
    }
  }, [id]);

  const loadBrands = async () => {
    try {
      const data = await brandService.getAllBrands({ limit: 100 });
      setBrands(data.data);
    } catch (error) {
      console.error('Markalarni yuklashda xatolik:', error);
    }
  };

  const loadCar = async () => {
    try {
      const data = await carService.getCarById(id);
      const car = data.data;
      setFormData({
        brand: car.brand._id,
        model: car.model,
        year: car.year,
        price: car.price,
        color: car.color,
        fuelType: car.fuelType,
        transmission: car.transmission,
        engineCapacity: car.engineCapacity || '',
        mileage: car.mileage,
        description: car.description || '',
        isAvailable: car.isAvailable,
      });
      setFeatures(car.features.length > 0 ? car.features : ['']);
    } catch (error) {
      setError('Avtomobilni yuklashda xatolik yuz berdi');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleExteriorImageChange = (e) => {
    setExteriorImages([...e.target.files]);
  };

  const handleInteriorImageChange = (e) => {
    setInteriorImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();

    // Add text fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Add features
    const filteredFeatures = features.filter((f) => f.trim() !== '');
    formDataToSend.append('features', JSON.stringify(filteredFeatures));

    // Add images
    exteriorImages.forEach((file) => {
      formDataToSend.append('exterior', file);
    });

    interiorImages.forEach((file) => {
      formDataToSend.append('interior', file);
    });

    try {
      if (isEdit) {
        await carService.updateCar(id, formDataToSend);
      } else {
        await carService.createCar(formDataToSend);
      }
      navigate('/admin/cars');
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        to="/admin/cars"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Ortga
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        {isEdit ? 'Avtomobilni tahrirlash' : 'Yangi avtomobil qo\'shish'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marka *
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Marka tanlang</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yil *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input-field"
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narx (so'm) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rang *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yoqilg'i turi *
            </label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="benzin">Benzin</option>
              <option value="dizel">Dizel</option>
              <option value="elektr">Elektr</option>
              <option value="gibrid">Gibrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmissiya *
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="mexanika">Mexanika</option>
              <option value="avtomat">Avtomat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dvigatel hajmi
            </label>
            <input
              type="text"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleChange}
              className="input-field"
              placeholder="2.0L"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yurgan masofa (km)
            </label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="input-field"
              min="0"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ta'rif
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            rows="4"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xususiyatlar
          </label>
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="input-field flex-1"
                placeholder="Masalan: ABS tormoz tizimi"
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="w-5 h-5" />
            Xususiyat qo'shish
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tashqi rasmlar {!isEdit && '*'}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleExteriorImageChange}
            className="input-field"
            required={!isEdit}
          />
          {exteriorImages.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {exteriorImages.length} ta fayl tanlandi
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ichki rasmlar
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleInteriorImageChange}
            className="input-field"
          />
          {interiorImages.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {interiorImages.length} ta fayl tanlandi
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Sotuvda
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Yuklanmoqda...' : isEdit ? 'Yangilash' : 'Qo\'shish'}
          </button>
          <Link to="/admin/cars" className="btn-secondary">
            Bekor qilish
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminCarForm;
