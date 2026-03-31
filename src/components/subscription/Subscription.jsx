import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Users, FileText, CheckCircle, ArrowUpCircle, CreditCard } from 'lucide-react';

const Subscription = ({ token }) => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/subscription/plan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan) => {
    // Guardar el plan seleccionado
    localStorage.setItem('pending_upgrade', plan);
    // Redirigir al simulador de pago
    navigate('/payment/simulator');
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'free': return 'bg-gray-100 border-gray-300';
      case 'pro': return 'bg-blue-50 border-blue-300';
      case 'enterprise': return 'bg-purple-50 border-purple-300';
      default: return 'bg-gray-100';
    }
  };

  const getUsagePercentage = () => {
    if (!subscription) return 0;
    const usersPercent = (subscription.current_users / subscription.max_users) * 100;
    const permitsPercent = (subscription.current_month_permits / subscription.max_permits_per_month) * 100;
    return Math.max(usersPercent, permitsPercent);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando información de suscripción...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className={`rounded-xl shadow-lg overflow-hidden mb-6 border-2 ${getPlanColor(subscription.plan)}`}>
        <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Plan {subscription.plan_name}</h2>
              <p className="text-green-200 mt-1">
                {subscription.expires_at 
                  ? `Válido hasta: ${new Date(subscription.expires_at).toLocaleDateString('es-ES')}` 
                  : 'Plan gratuito - sin fecha de expiración'}
              </p>
            </div>
            <Crown className="w-12 h-12 text-yellow-300" />
          </div>
        </div>
        
        <div className="p-6 bg-white">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uso del plan</span>
              <span>{Math.round(getUsagePercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Usuarios</span>
              </div>
              <p className="text-2xl font-bold">
                {subscription.current_users} / {subscription.max_users === 999999 ? '∞' : subscription.max_users}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Permisos este mes</span>
              </div>
              <p className="text-2xl font-bold">
                {subscription.current_month_permits} / {subscription.max_permits_per_month === 999999 ? '∞' : subscription.max_permits_per_month}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Características incluidas:</h3>
            <div className="grid grid-cols-2 gap-2">
              {subscription.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{feature.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {subscription.plan === 'free' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ArrowUpCircle className="w-6 h-6 text-green-600" />
            Actualiza tu plan
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-blue-600">Plan Pro</h4>
              <p className="text-2xl font-bold mt-2">$49<span className="text-sm text-gray-500">/mes</span></p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>✓ Hasta 20 usuarios</li>
                <li>✓ 1,000 permisos/mes</li>
                <li>✓ Firma con GPS</li>
                <li>✓ Evidencia fotográfica</li>
                <li>✓ Modo offline</li>
                <li>✓ Soporte prioritario</li>
              </ul>
              <button
                onClick={() => handleUpgrade('pro')}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Probar Pago (Simulación)
              </button>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-purple-600">Enterprise</h4>
              <p className="text-2xl font-bold mt-2">$99<span className="text-sm text-gray-500">/mes</span></p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>✓ Usuarios ilimitados</li>
                <li>✓ Permisos ilimitados</li>
                <li>✓ API Access</li>
                <li>✓ Dashboard personalizado</li>
                <li>✓ Soporte 24/7</li>
                <li>✓ Implementación dedicada</li>
              </ul>
              <button
                onClick={() => handleUpgrade('enterprise')}
                className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Contactar Ventas
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 text-center">
              🧪 Modo de prueba: Al hacer clic, serás redirigido al simulador donde podrás activar el plan Pro inmediatamente.
            </p>
          </div>
        </div>
      )}
      
      {subscription.plan === 'pro' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            🎉 ¡Disfruta de tu plan Pro! Tienes acceso a todas las características premium.
          </p>
        </div>
      )}
    </div>
  );
};

export default Subscription;