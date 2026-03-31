import React from 'react';

const Alert = ({ type, message, icon: Icon }) => {
  const colors = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800'
  };

  return (
    <div className={`${colors[type]} border-l-4 p-4 rounded-lg flex items-start gap-3`}>
      {Icon && <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />}
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;