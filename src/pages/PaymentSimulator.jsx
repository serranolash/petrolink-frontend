import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle, Shield, Loader2, CheckCircle } from 'lucide-react';
import API_URL from '../config/api';

const PaymentSimulator = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('5031 7532 0000 0004');
  const [expiry, setExpiry] = useState('11/25');
  const [cvv, setCvv] = useState('123');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    
    try {
      // Obtener información del usuario
      const userStr = localStorage.getItem('user');
      let companyId = 1;
      let plan = 'pro';
      let token = localStorage.getItem('token');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        companyId = user.company_id;
      }
      
      const pendingUpgrade = localStorage.getItem('pending_upgrade');
      if (pendingUpgrade) {
        plan = pendingUpgrade.split('_')[0];
      }
      
      console.log('💰 Procesando pago para:', { companyId, plan });
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar directamente la suscripción
      const upgradeResponse = await fetch(`${API_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plan })
      });
      
      const upgradeData = await upgradeResponse.json();
      
      if (upgradeData.success) {
        setSuccess(true);
        localStorage.removeItem('pending_upgrade');
        
        // Actualizar el usuario en localStorage con el nuevo plan
        if (userStr) {
          const user = JSON.parse(userStr);
          user.subscription_plan = plan;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/payment/success');
        }, 1500);
      } else {
        throw new Error(upgradeData.error || 'Error al actualizar el plan');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar el pago');
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Procesado!</h1>
          <p className="text-gray-600">Redirigiendo al panel de control...</p>
          <div className="animate-pulse mt-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-3" />
            <h1 className="text-2xl font-bold">Simulador de Pago</h1>
            <p className="text-blue-200 text-sm">Modo de pruebas - No se realizarán cargos reales</p>
          </div>
          
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Datos de prueba</span>
              </div>
              <p className="text-sm text-yellow-700">
                Usa estos datos para simular un pago exitoso:
              </p>
              <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                <li>• Tarjeta: 5031 7532 0000 0004</li>
                <li>• CVV: 123</li>
                <li>• Fecha: 11/25 o cualquier fecha futura</li>
              </ul>
            </div>
            
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg font-mono"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha expiración
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="123"
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Simular Pago y Activar Plan
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-gray-500">
              Al hacer clic, se activará el plan Pro inmediatamente (modo simulación).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSimulator;