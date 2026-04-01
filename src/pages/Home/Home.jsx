// client/src/pages/Home/Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileCheck, 
  Camera, 
  PenTool, 
  Wifi, 
  BarChart3, 
  Users, 
  Award, 
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  Globe,
  Zap
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FileCheck className="w-6 h-6 text-cyan-500" />,
      title: 'Permisos Digitales',
      description: 'Crea y gestiona permisos de trabajo seguro con firma digital y evidencia fotográfica.'
    },
    {
      icon: <Camera className="w-6 h-6 text-cyan-500" />,
      title: 'Evidencia Fotográfica',
      description: 'Captura fotos como prueba del cumplimiento de medidas de seguridad.'
    },
    {
      icon: <PenTool className="w-6 h-6 text-cyan-500" />,
      title: 'Firma Digital con GPS',
      description: 'Firmas con geolocalización que garantizan la validez legal de los permisos.'
    },
    {
      icon: <Wifi className="w-6 h-6 text-cyan-500" />,
      title: 'Trabajo Offline',
      description: 'Opera sin conexión a internet, ideal para zonas remotas.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-500" />,
      title: 'Dashboard Analítico',
      description: 'Visualiza estadísticas, tasa de aprobación y historial de permisos.'
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-500" />,
      title: 'Gestión de Equipos',
      description: 'Administra técnicos, supervisores y controla sus permisos.'
    }
  ];

  const stats = [
    { value: '98%', label: 'Reducción de errores', icon: <TrendingUp className="w-5 h-5" /> },
    { value: '95%', label: 'Menos tiempo en aprobaciones', icon: <Clock className="w-5 h-5" /> },
    { value: '100%', label: 'Cumplimiento normativo', icon: <CheckCircle className="w-5 h-5" /> },
    { value: '24/7', label: 'Disponibilidad total', icon: <Globe className="w-5 h-5" /> }
  ];

  const handleRegister = () => {
    navigate('/register');
  };

  const handlePricing = () => {
    navigate('/pricing');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <div className="bg-slate-50">
      {/* Hero Section - Estilo industrial */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* Patrón industrial de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">Industria 4.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Gestión Inteligente de
                <span className="text-cyan-400 block"> Permisos de Trabajo Seguro</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Transforma la burocracia en un activo de seguridad activo. 
                Digitaliza, automatiza y controla todos los permisos de trabajo 
                en la industria energética de LATAM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRegister}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-center cursor-pointer"
                >
                  Comenzar Prueba Gratis
                </button>
                <button
                  onClick={handlePricing}
                  className="border-2 border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all text-center cursor-pointer"
                >
                  Ver Planes
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-2xl opacity-20"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-slate-400 text-sm">energy-compliance.sh</span>
                  </div>
                  <pre className="text-sm text-slate-300 font-mono">
                    <code>{`> ./permiso --create
✓ Riesgo: ALTURA verificado
✓ EPP: Arnés, Anclaje OK
✓ Firma digital capturada
✓ GPS: -34.6037, -58.3816
✓ Permiso APROBADO

Documento generado: PTC-2024-001
Firma del Supervisor: ✓
Timestamp: 2024-03-31T12:00:00Z`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Industrial */}
      <div className="bg-slate-800 py-12 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                  {stat.icon}
                  <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              ¿Por qué elegir Energy-Compliance?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Una plataforma completa para la gestión de seguridad industrial
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-cyan-200 hover:shadow-lg transition-all group">
                <div className="mb-4 p-2 bg-cyan-50 rounded-lg w-12 h-12 flex items-center justify-center group-hover:bg-cyan-100 transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Únete a las empresas que ya confían en nosotros
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Más de 50 empresas en LATAM utilizan Energy-Compliance
          </p>
          <button
            onClick={handleRegister}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 cursor-pointer"
          >
            Solicitar Demo Gratuita
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;