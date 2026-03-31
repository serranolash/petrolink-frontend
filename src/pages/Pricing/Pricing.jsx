import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Shield, Users, FileText, BarChart3, Headset } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'mes',
      description: 'Ideal para pequeñas empresas que inician',
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
        { name: 'Soporte prioritario', included: false }
      ],
      buttonText: 'Comenzar Gratis',
      buttonVariant: 'outline'
    },
    {
      name: 'Pro',
      price: '49',
      period: 'mes',
      description: 'Para empresas en crecimiento',
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
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Planes y Precios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu empresa.
            Todos los planes incluyen 14 días de prueba gratuita.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-green-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                  MÁS POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">${plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-500'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border-2 border-green-600 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">¿Necesitas un plan personalizado?</h3>
          <p className="text-gray-600 mb-6">
            Contáctanos para crear un plan a medida para tu empresa con requisitos específicos.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Contactar Ventas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;