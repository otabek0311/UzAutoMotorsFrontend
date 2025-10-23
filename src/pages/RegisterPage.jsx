import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Register, 2: OTP Verification
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      if (response.success) {
        setSuccess(response.message);
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp({
        email: formData.email,
        otp,
      });
      if (response.success) {
        setSuccess(response.message);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'OTP tasdiqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <Car className="w-10 h-10 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">UzAutoMotors</span>
        </Link>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-2">Ro'yxatdan o'tish</h2>
              <p className="text-gray-600 text-center mb-8">Yangi hisob yarating</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ism va Familiya
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Ismi Familiyasi"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Kamida 6 ta belgi"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqami (ixtiyoriy)
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Yuklanmoqda...' : 'Ro\'yxatdan o\'tish'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-2">Email tasdiqlash</h2>
              <p className="text-gray-600 text-center mb-8">
                {formData.email} manziliga yuborilgan kodni kiriting
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasdiqlash kodi
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError('');
                    }}
                    className="input-field text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full btn-secondary"
                >
                  Ortga
                </button>
              </form>
            </>
          )}

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Hisobingiz bormi?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Kirish
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
