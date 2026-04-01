// client/src/components/subscription/Subscription.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Users, FileText, CheckCircle, ArrowUpCircle, CreditCard, TrendingUp, MapPin, Wifi, BarChart3 } from 'lucide-react';

const Subscription = ({ token }) => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

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

  const handleUpgrade = async (plan) => {
    setUpgrading(true);
    try {
      const response = await fetch('http://localhost:3001/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });
      const data = await response.json();
      if (data.success) {
        fetchSubscription();
        alert(`¡Plan actualizado a ${data.subscription.plan_name}!`);
      } else {
        alert(data.error || 'Error al actualizar');
      }
    } catch (error) {
      alert('Error al actualizar el plan');
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'starter': return 'bg-blue-50 border-blue-300';
      case 'business': return 'bg-cyan-50 border-cyan-300';
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

  const isBusiness = subscription?.plan === 'business';
  const isStarter = subscription?.plan === 'starter';
  const isEnterprise = subscription?.plan === 'enterprise';

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Plan Actual */}
      <div className={`rounded-xl shadow-lg overflow-hidden mb-6 border-2 ${getPlanColor(subscription.plan)}`}>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Plan {subscription.plan_name}</h2>
              <p className="text-slate-300 mt-1">
                {subscription.company_name}
              </p>
            </div>
            <Crown className="w-12 h-12 text-yellow-400" />
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
                className="bg-cyan-600 h-2 rounded-full transition-all"
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

      {/* Upgrade Options */}
      {isStarter && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ArrowUpCircle className="w-6 h-6 text-cyan-600" />
            Actualiza tu plan
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-cyan-600">Business</h4>
              <p className="text-2xl font-bold mt-2">$499<span className="text-sm text-gray-500">/mes</span></p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>✓ Hasta 50 usuarios</li>
                <li>✓ 2,000 permisos/mes</li>
                <li>✓ Firma avanzada + Biometría</li>
                <li>✓ Geocerca (Radio seguridad)</li>
                <li>✓ Dashboard analítica</li>
                <li>✓ API Access</li>
                <li>✓ Soporte prioritario</li>
              </ul>
              <button
                onClick={() => handleUpgrade('business')}
                disabled={upgrading}
                className="mt-4 w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
              >
                {upgrading ? 'Procesando...' : 'Actualizar a Business'}
              </button>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-purple-600">Enterprise</h4>
              <p className="text-2xl font-bold mt-2">Personalizado</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>✓ Usuarios ilimitados</li>
                <li>✓ Permisos ilimitados</li>
                <li>✓ Firma legal/gubernamental</li>
                <li>✓ Integración ERP (SAP)</li>
                <li>✓ Auditoría para entes reguladores</li>
                <li>✓ Gerente de cuenta 24/7</li>
              </ul>
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isBusiness && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-center">
          <p className="text-cyan-800">
            🎉 ¡Disfruta de tu plan Business! Tienes acceso a todas las características premium.
          </p>
        </div>
      )}
      
      {isEnterprise && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-purple-800">
            🏢 Plan Enterprise activo. Disfruta de todas las características corporativas.
          </p>
        </div>
      )}
    </div>
  );
};

export default Subscription;