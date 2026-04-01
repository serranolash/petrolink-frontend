// client/src/pages/Pricing/Pricing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Shield, Users, FileText, BarChart3, Headset, MapPin, Wifi, Globe, TrendingUp, AlertCircle, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '149',
      period: 'mes',
      description: 'Ideal para pequeños contratistas',
      badge: 'Base',
      icon: <Shield className="w-8 h-8 text-cyan-500" />,
      features: [
        { name: 'Hasta 10 usuarios', included: true, highlight: false },
        { name: '200 permisos/mes', included: true, highlight: false },
        { name: 'Firma digital (Pin/Dibujo)', included: true, highlight: false },
        { name: 'GPS básico', included: true, highlight: false },
        { name: 'Modo Offline', included: true, highlight: false },
        { name: 'PDF básico', included: true, highlight: false },
        { name: 'Dashboard básico', included: true, highlight: false },
        { name: 'Soporte email (48h)', included: true, highlight: false },
        { name: 'Geocerca (Radio seguridad)', included: false, highlight: false },
        { name: 'Acceso API', included: false, highlight: false },
        { name: 'Dashboard analítica', included: false, highlight: false },
        { name: 'Integración ERP', included: false, highlight: false }
      ],
      buttonText: 'Comenzar Demo',
      buttonVariant: 'outline',
      popular: false
    },
    {
      name: 'Business',
      price: '499',
      period: 'mes',
      description: 'Para empresas en crecimiento',
      badge: 'Más Elegido',
      icon: <TrendingUp className="w-8 h-8 text-cyan-500" />,
      features: [
        { name: 'Hasta 50 usuarios', included: true, highlight: true },
        { name: '2,000 permisos/mes', included: true, highlight: true },
        { name: 'Firma avanzada (Hash + Biometría)', included: true, highlight: false },
        { name: 'Geocerca (Radio seguridad)', included: true, highlight: false },
        { name: 'Modo Offline + API', included: true, highlight: false },
        { name: 'Dashboard analítica', included: true, highlight: false },
        { name: 'Reportes avanzados', included: true, highlight: false },
        { name: 'Soporte prioritario (Chat/WhatsApp)', included: true, highlight: false },
        { name: 'Mapas de calor de riesgo', included: true, highlight: false },
        { name: 'Firma legal/gubernamental', included: false, highlight: false },
        { name: 'Integración ERP', included: false, highlight: false },
        { name: 'Auditoría para entes reguladores', included: false, highlight: false }
      ],
      buttonText: 'Elegir Business',
      buttonVariant: 'primary',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      period: '',
      description: 'Para multinacionales y operadoras',
      badge: 'Corporativo',
      icon: <Globe className="w-8 h-8 text-cyan-500" />,
      features: [
        { name: 'Usuarios ilimitados', included: true, highlight: true },
        { name: 'Permisos ilimitados', included: true, highlight: true },
        { name: 'Firma legal/gubernamental', included: true, highlight: false },
        { name: 'Mapas de calor de riesgo', included: true, highlight: false },
        { name: 'Integración Full ERP (SAP)', included: true, highlight: false },
        { name: 'Auditoría para entes reguladores', included: true, highlight: false },
        { name: 'Dashboard personalizado', included: true, highlight: false },
        { name: 'Gerente de cuenta 24/7', included: true, highlight: false },
        { name: 'Implementación dedicada', included: true, highlight: false }
      ],
      buttonText: 'Contactar Ventas',
      buttonVariant: 'outline',
      popular: false
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Planes Corporativos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invierte en Seguridad,<br />
            <span className="text-cyan-400">Evita Multas Millonarias</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Protege tu operación por menos del costo de un equipo de protección personal.
          </p>
        </div>
      </div>

      {/* Banner de alerta */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>¿Sabías que una falla de cumplimiento en un permiso de trabajo puede costar más de <strong>$50,000 en multas</strong>? Protege tu operación por menos del costo de un EPP.</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'ring-2 ring-cyan-500 shadow-lg transform md:-translate-y-2' 
                  : 'border border-slate-200 hover:border-cyan-200'
              }`}
            >
              {plan.badge && (
                <div className={`absolute top-0 right-0 ${
                  plan.popular ? 'bg-cyan-500' : 'bg-slate-600'
                } text-white text-xs font-bold px-4 py-1 rounded-bl-lg z-10`}>
                  {plan.badge}
                </div>
              )}
              
              <div className="p-6">
                <div className="mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-800">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.period && <span className="text-slate-500">/{plan.period}</span>}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          feature.highlight ? 'text-cyan-500' : 'text-green-500'
                        }`} />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-slate-700' : 'text-slate-400 text-sm'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700 transform hover:scale-105'
                      : 'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Valor agregado */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Necesitas un plan personalizado?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Contáctanos para crear un plan a medida para tu empresa con requisitos específicos.
              Incluye soporte dedicado y personalización de la plataforma.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Contactar Ventas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;