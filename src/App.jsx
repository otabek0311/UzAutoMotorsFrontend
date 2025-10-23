import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CarsPage from './pages/CarsPage'
import CarDetailPage from './pages/CarDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBrands from './pages/admin/AdminBrands'
import AdminCars from './pages/admin/AdminCars'
import AdminCarForm from './pages/admin/AdminCarForm'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/cars" element={<CarsPage />} />
      <Route path="/cars/:id" element={<CarDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="cars" element={<AdminCars />} />
        <Route path="cars/new" element={<AdminCarForm />} />
        <Route path="cars/edit/:id" element={<AdminCarForm />} />
      </Route>
    </Routes>
  )
}

export default App
