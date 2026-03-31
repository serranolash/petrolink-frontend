import React from 'react';

const RISK_TYPES = [
  { value: 'ALTURA', label: 'Trabajo en Altura', icon: '📈', color: 'bg-orange-100' },
  { value: 'ELECTRICO', label: 'Riesgo Eléctrico', icon: '⚡', color: 'bg-yellow-100' },
  { value: 'CONFINADO', label: 'Espacio Confinado', icon: '🚪', color: 'bg-blue-100' },
  { value: 'CALIENTE', label: 'Trabajo en Caliente', icon: '🔥', color: 'bg-red-100' }
];

const RiskSelector = ({ selectedRisk, onSelect }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Tipo de Riesgo *
      </label>
      <div className="grid grid-cols-2 gap-3">
        {RISK_TYPES.map(risk => (
          <button
            key={risk.value}
            type="button"
            onClick={() => onSelect(risk.value)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selectedRisk === risk.value
                ? 'border-green-600 bg-green-50 ring-2 ring-green-200'
                : 'border-gray-200 bg-white hover:border-green-400'
            }`}
          >
            <span className="text-3xl block mb-2">{risk.icon}</span>
            <span className="text-sm font-medium">{risk.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RiskSelector;
