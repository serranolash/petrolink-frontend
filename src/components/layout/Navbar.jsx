import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, CreditCard, Mail, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="font-bold text-xl text-gray-800">Energy-Compliance</span>
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-green-600 transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-green-600 transition flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Precios
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600 transition flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Contacto
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/app')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Ir al Panel
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;