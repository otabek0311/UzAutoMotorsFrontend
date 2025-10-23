import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/CarCard';
import { carService } from '../services/carService';
import { brandService } from '../services/brandService';
import { authService } from '../services/authService';

function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    year: searchParams.get('year') || '',
  });

  useEffect(() => {
    loadUser();
    loadBrands();
  }, []);

  useEffect(() => {
    loadCars();
  }, [searchParams]);

  const loadUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData.data);
      } catch (error) {
        console.log('User not authenticated');
      }
    }
  };

  const loadBrands = async () => {
    try {
      const data = await brandService.getAllBrands({ limit: 100 });
      setBrands(data.data);
    } catch (error) {
      console.error('Markalarni yuklashda xatolik:', error);
    }
  };

  const loadCars = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const data = await carService.getAllCars(params);
      setCars(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Avtomobillarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      year: '',
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Avtomobillar</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filtrlash</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-primary-600"
            >
              <Filter className="w-5 h-5" />
              Filtrlar
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Qidirish..."
                className="input-field"
              />

              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Barcha markalar</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <select
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Yoqilg'i turi</option>
                <option value="benzin">Benzin</option>
                <option value="dizel">Dizel</option>
                <option value="elektr">Elektr</option>
                <option value="gibrid">Gibrid</option>
              </select>

              <select
                name="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Transmissiya</option>
                <option value="mexanika">Mexanika</option>
                <option value="avtomat">Avtomat</option>
              </select>

              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min narx"
                className="input-field"
              />

              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max narx"
                className="input-field"
              />

              <input
                type="number"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                placeholder="Yil"
                className="input-field"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={applyFilters} className="btn-primary">
                Qo'llash
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                Tozalash
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cars.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Jami {pagination.total} ta avtomobil topildi
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pagination.pages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const params = Object.fromEntries(searchParams);
                      params.page = index + 1;
                      setSearchParams(params);
                    }}
                    className={`px-4 py-2 rounded ${
                      pagination.page === index + 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Avtomobillar topilmadi</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CarsPage;
