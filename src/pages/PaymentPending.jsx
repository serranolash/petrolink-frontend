import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';

const PaymentPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 to-yellow-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago Pendiente</h1>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Recibirás una confirmación por email.
        </p>
        <button
          onClick={() => navigate('/app')}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Panel
        </button>
      </div>
    </div>
  );
};

export default PaymentPending;