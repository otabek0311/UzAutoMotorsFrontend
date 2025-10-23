import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Settings, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { carService } from '../services/carService';
import { authService } from '../services/authService';

function CarDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exterior');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

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

      const data = await carService.getCarById(id);
      setCar(data.data);
      if (data.data.images?.exterior?.length > 0) {
        setSelectedImage(data.data.images.exterior[0]);
      }
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Avtomobil topilmadi</h2>
          <Link to="/cars" className="text-primary-600 hover:underline">
            Ortga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const images = activeTab === 'exterior' ? car.images.exterior : car.images.interior;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <Link to="/cars" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Ortga
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Images Section */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              {/* Main Image */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt={`${car.brand?.name} ${car.model}`}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Image Tabs */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => {
                    setActiveTab('exterior');
                    if (car.images.exterior?.length > 0) {
                      setSelectedImage(car.images.exterior[0]);
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded ${
                    activeTab === 'exterior'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Tashqi ko'rinish
                </button>
                <button
                  onClick={() => {
                    setActiveTab('interior');
                    if (car.images.interior?.length > 0) {
                      setSelectedImage(car.images.interior[0]);
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded ${
                    activeTab === 'interior'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Ichki ko'rinish
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {images?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded overflow-hidden border-2 ${
                      selectedImage === img ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {car.brand?.name} {car.model}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <Eye className="w-5 h-5" />
                <span>{car.viewCount} marta ko'rilgan</span>
              </div>

              <div className="text-4xl font-bold text-primary-600 mb-8">
                {formatPrice(car.price)}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Yil</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Yurgan masofa</div>
                    <div className="font-semibold">{car.mileage} km</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Fuel className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Yoqilg'i</div>
                    <div className="font-semibold capitalize">{car.fuelType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Transmissiya</div>
                    <div className="font-semibold capitalize">{car.transmission}</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Rang</span>
                  <span className="font-semibold">{car.color}</span>
                </div>
                {car.engineCapacity && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Dvigatel hajmi</span>
                    <span className="font-semibold">{car.engineCapacity}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              {car.isAvailable ? (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block mb-6">
                  Sotuvda
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg inline-block mb-6">
                  Sotilgan
                </div>
              )}
            </div>
          </div>

          {/* Description and Features */}
          <div className="p-8 border-t">
            {car.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Ta'rif</h2>
                <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </div>
            )}

            {car.features?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Xususiyatlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CarDetailPage;
