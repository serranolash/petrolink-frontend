import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago Fallido</h1>
        <p className="text-gray-600 mb-6">
          El pago no pudo ser procesado. Por favor intenta nuevamente.
        </p>
        <button
          onClick={() => navigate('/app')}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Panel
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;