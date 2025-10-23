import { Link } from 'react-router-dom';
import { Calendar, Gauge, Fuel } from 'lucide-react';

function CarCard({ car }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const getFirstImage = () => {
    if (car.images?.exterior?.length > 0) {
      return car.images.exterior[0];
    }
    return '/placeholder-car.jpg';
  };

  return (
    <Link to={`/cars/${car._id}`} className="card group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getFirstImage()}
          alt={`${car.brand?.name} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!car.isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Sotilgan
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {car.brand?.name} {car.model}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{car.mileage} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-primary-600">
            {formatPrice(car.price)}
          </p>
          <span className="text-sm text-gray-500">{car.transmission}</span>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;
