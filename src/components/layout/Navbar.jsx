// client/src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, CreditCard, Mail, LogIn, UserPlus, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-cyan-600 transition flex items-center gap-1 py-2 md:py-0">
        <Home className="w-4 h-4" />
        Inicio
      </Link>
      <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-cyan-600 transition flex items-center gap-1 py-2 md:py-0">
        <CreditCard className="w-4 h-4" />
        Precios
      </Link>
      <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-cyan-600 transition flex items-center gap-1 py-2 md:py-0">
        <Mail className="w-4 h-4" />
        Contacto
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Shield className="w-8 h-8 text-cyan-600" />
            <span className="font-bold text-xl text-slate-800 hidden sm:inline">Energy-Compliance</span>
            <span className="font-bold text-xl text-slate-800 sm:hidden">EC</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/app')}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
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
                  className="flex items-center gap-1 px-4 py-2 border border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col space-y-3">
              <NavLinks />
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/app');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition text-center"
                  >
                    Ir al Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-red-600 hover:text-red-700 transition text-center py-2"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center border border-cyan-600 text-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-50 transition"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;