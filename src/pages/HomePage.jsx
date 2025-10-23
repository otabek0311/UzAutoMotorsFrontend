import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/CarCard';
import { carService } from '../services/carService';
import { brandService } from '../services/brandService';
import { authService } from '../services/authService';

function HomePage() {
  const [user, setUser] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [latestCars, setLatestCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData.data);
        } catch (error) {
          console.log('User not authenticated');
        }
      }

      const [popularData, latestData, brandsData] = await Promise.all([
        carService.getPopularCars(8),
        carService.getLatestCars(8),
        brandService.getAllBrands({ limit: 8, isActive: true }),
      ]);

      setPopularCars(popularData.data);
      setLatestCars(latestData.data);
      setBrands(brandsData.data);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              O'zingizga mos avtomobilni toping
            </h1>
            <p className="text-xl mb-8">
              Eng yaxshi narxlarda, ishonchli va sifatli mashinalar
            </p>
            <Link to="/cars" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Avtomobillarni ko'rish
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mashhur markalar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/cars?brand=${brand._id}`}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm font-medium text-gray-700">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Mashhur avtomobillar</h2>
            <Link to="/cars" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
              Barchasini ko'rish
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Yangi qo'shilgan</h2>
            <Link to="/cars" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
              Barchasini ko'rish
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
