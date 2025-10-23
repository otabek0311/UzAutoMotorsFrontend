import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { carService } from '../../services/carService';

function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCars();
  }, [currentPage]);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await carService.getAllCars({ page: currentPage, limit: 10 });
      setCars(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Avtomobillarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Avtomobilni o\'chirishni xohlaysizmi?')) return;

    try {
      await carService.deleteCar(id);
      setSuccess('Avtomobil muvaffaqiyatli o\'chirildi!');
      loadCars();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'O\'chirishda xatolik yuz berdi');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
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
        <h1 className="text-3xl font-bold">Avtomobillar</h1>
        <Link to="/admin/cars/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Avtomobil qo'shish
        </Link>
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

      {/* Cars Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Rasm</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Model</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Marka</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Yil</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Narx</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Holat</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <img
                      src={car.images?.exterior?.[0] || '/placeholder.jpg'}
                      alt={car.model}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium">{car.model}</td>
                  <td className="py-4 px-6">{car.brand?.name}</td>
                  <td className="py-4 px-6">{car.year}</td>
                  <td className="py-4 px-6">{formatPrice(car.price)}</td>
                  <td className="py-4 px-6">
                    {car.isAvailable ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Sotuvda
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Sotilgan
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/cars/edit/${car._id}`}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-6 border-t">
            {[...Array(pagination.pages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  pagination.page === index + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCars;
