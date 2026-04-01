// client/src/pages/Pricing/Pricing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Shield, Users, FileText, BarChart3, Headset, Zap, TrendingUp, Clock, Globe, ChevronRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'mes',
      description: 'Ideal para pequeñas empresas que inician',
      badge: null,
      features: [
        { name: 'Hasta 5 usuarios', included: true },
        { name: '100 permisos/mes', included: true },
        { name: 'Firma digital básica', included: true },
        { name: 'Dashboard básico', included: true },
        { name: 'Soporte por email', included: true },
        { name: 'Evidencia fotográfica', included: false },
        { name: 'Firma con GPS', included: false },
        { name: 'Modo offline', included: false },
        { name: 'API Access', included: false },
        { name: 'Soporte 24/7', included: false }
      ],
      buttonText: 'Comenzar Gratis',
      buttonVariant: 'outline'
    },
    {
      name: 'Pro',
      price: '49',
      period: 'mes',
      description: 'Para empresas en crecimiento',
      badge: 'MÁS POPULAR',
      popular: true,
      features: [
        { name: 'Hasta 20 usuarios', included: true },
        { name: '1,000 permisos/mes', included: true },
        { name: 'Firma digital avanzada', included: true },
        { name: 'Dashboard avanzado', included: true },
        { name: 'Soporte prioritario', included: true },
        { name: 'Evidencia fotográfica', included: true },
        { name: 'Firma con GPS', included: true },
        { name: 'Modo offline', included: true },
        { name: 'API Access', included: false },
        { name: 'Soporte 24/7', included: false }
      ],
      buttonText: 'Elegir Pro',
      buttonVariant: 'primary'
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'mes',
      description: 'Para grandes corporaciones',
      badge: null,
      features: [
        { name: 'Usuarios ilimitados', included: true },
        { name: 'Permisos ilimitados', included: true },
        { name: 'Firma digital avanzada', included: true },
        { name: 'Dashboard personalizado', included: true },
        { name: 'Soporte 24/7', included: true },
        { name: 'Evidencia fotográfica', included: true },
        { name: 'Firma con GPS', included: true },
        { name: 'Modo offline', included: true },
        { name: 'API Access', included: true },
        { name: 'Implementación dedicada', included: true }
      ],
      buttonText: 'Contactar Ventas',
      buttonVariant: 'outline'
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Planes flexibles</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Planes y Precios
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu empresa.
            Todos los planes incluyen 14 días de prueba gratuita.
          </p>
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
                <div className="absolute top-0 right-0">
                  <div className="bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-800">${plan.price}</span>
                  <span className="text-slate-500">/{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/register"
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

        {/* Enterprise CTA */}
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
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;