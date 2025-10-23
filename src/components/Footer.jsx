import { Car, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo va ma'lumot */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold text-white">UzAutoMotors</span>
            </div>
            <p className="text-sm">
              O'zbekistonning eng yaxshi avtomobil sayti. Bizda sifatli va ishonchli mashinalar.
            </p>
          </div>

          {/* Tezkor havolalar */}
          <div>
            <h3 className="text-white font-bold mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-500 transition">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/cars" className="hover:text-primary-500 transition">
                  Avtomobillar
                </Link>
              </li>
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h3 className="text-white font-bold mb-4">Aloqa</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@uzautomotors.uz</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Toshkent, O'zbekiston</span>
              </li>
            </ul>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div>
            <h3 className="text-white font-bold mb-4">Ijtimoiy tarmoqlar</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                F
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                T
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
              >
                I
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 UzAutoMotors. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
