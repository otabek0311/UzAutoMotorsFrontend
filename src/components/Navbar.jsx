import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../services/authService';

function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">UzAutoMotors</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Bosh sahifa
            </Link>
            <Link to="/cars" className="text-gray-700 hover:text-primary-600 transition">
              Avtomobillar
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Kirish
                </Link>
                <Link to="/register" className="btn-primary">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Bosh sahifa
              </Link>
              <Link to="/cars" className="text-gray-700 hover:text-primary-600">
                Avtomobillar
              </Link>
              
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-red-600"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600">
                    Kirish
                  </Link>
                  <Link to="/register" className="btn-primary inline-block text-center">
                    Ro'yxatdan o'tish
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
