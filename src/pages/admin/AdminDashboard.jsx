import { useState, useEffect } from 'react';
import { Tag, CarFront, Eye, TrendingUp } from 'lucide-react';
import { carService } from '../../services/carService';
import { brandService } from '../../services/brandService';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBrands: 0,
    availableCars: 0,
    soldCars: 0,
  });
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [carsData, brandsData, availableData, soldData] = await Promise.all([
        carService.getAllCars({ limit: 5 }),
        brandService.getAllBrands({ limit: 100 }),
        carService.getAllCars({ isAvailable: true, limit: 1 }),
        carService.getAllCars({ isAvailable: false, limit: 1 }),
      ]);

      setStats({
        totalCars: carsData.pagination.total,
        totalBrands: brandsData.pagination.total,
        availableCars: availableData.pagination.total,
        soldCars: soldData.pagination.total,
      });

      setRecentCars(carsData.data);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Jami avtomobillar',
      value: stats.totalCars,
      icon: CarFront,
      color: 'bg-blue-500',
    },
    {
      title: 'Jami markalar',
      value: stats.totalBrands,
      icon: Tag,
      color: 'bg-purple-500',
    },
    {
      title: 'Sotuvdagi avtomobillar',
      value: stats.availableCars,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Sotilgan avtomobillar',
      value: stats.soldCars,
      icon: Eye,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Cars */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">So'nggi qo'shilgan avtomobillar</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Rasm</th>
                <th className="text-left py-3 px-4">Model</th>
                <th className="text-left py-3 px-4">Marka</th>
                <th className="text-left py-3 px-4">Yil</th>
                <th className="text-left py-3 px-4">Narx</th>
                <th className="text-left py-3 px-4">Holat</th>
              </tr>
            </thead>
            <tbody>
              {recentCars.map((car) => (
                <tr key={car._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={car.images?.exterior?.[0] || '/placeholder.jpg'}
                      alt={car.model}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{car.model}</td>
                  <td className="py-3 px-4">{car.brand?.name}</td>
                  <td className="py-3 px-4">{car.year}</td>
                  <td className="py-3 px-4">
                    {new Intl.NumberFormat('uz-UZ').format(car.price)} so'm
                  </td>
                  <td className="py-3 px-4">
                    {car.isAvailable ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Sotuvda
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Sotilgan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
