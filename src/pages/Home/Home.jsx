import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileCheck, Camera, PenTool, Wifi, BarChart3, Users, Award, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <FileCheck className="w-8 h-8 text-green-600" />,
      title: 'Permisos Digitales',
      description: 'Crea y gestiona permisos de trabajo seguro con firma digital y evidencia fotográfica.'
    },
    {
      icon: <Camera className="w-8 h-8 text-green-600" />,
      title: 'Evidencia Fotográfica',
      description: 'Captura fotos como prueba del cumplimiento de medidas de seguridad.'
    },
    {
      icon: <PenTool className="w-8 h-8 text-green-600" />,
      title: 'Firma Digital con GPS',
      description: 'Firmas con geolocalización que garantizan la validez legal de los permisos.'
    },
    {
      icon: <Wifi className="w-8 h-8 text-green-600" />,
      title: 'Trabajo Offline',
      description: 'Opera sin conexión a internet, ideal para zonas remotas.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: 'Dashboard Analítico',
      description: 'Visualiza estadísticas, tasa de aprobación y historial de permisos.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Gestión de Equipos',
      description: 'Administra técnicos, supervisores y controla sus permisos.'
    }
  ];

  const stats = [
    { value: '98%', label: 'Reducción de errores documentales' },
    { value: '95%', label: 'Menos tiempo en aprobaciones' },
    { value: '100%', label: 'Cumplimiento normativo' },
    { value: '24/7', label: 'Disponibilidad total' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-900 to-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Gestión Inteligente de
              <span className="text-green-300"> Permisos de Trabajo Seguro</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Transforma la burocracia en un activo de seguridad activo. 
              Digitaliza, automatiza y controla todos los permisos de trabajo 
              en la industria energética de LATAM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Comenzar Prueba Gratis
              </Link>
              <Link
                to="/pricing"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir Energy-Compliance?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa para la gestión de seguridad industrial
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Únete a las empresas que ya confían en nosotros
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Más de 50 empresas en LATAM utilizan Energy-Compliance
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Solicitar Demo Gratuita
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;