import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SAFETY_CHECKS = {
  ALTURA: [
    { id: 'has_harness', label: '¿Cuenta con arnés de seguridad certificado?', critical: true },
    { id: 'has_anchor_point', label: '¿Punto de anclaje certificado?', critical: true },
    { id: 'has_lanyard', label: '¿Línea de vida con absorbedor?', critical: false }
  ],
  ELECTRICO: [
    { id: 'has_dielectric_ppe', label: '¿Cuenta con EPP dieléctrico completo?', critical: true },
    { id: 'voltage_test_performed', label: '¿Prueba de ausencia de tensión realizada?', critical: true },
    { id: 'has_grounding', label: '¿Sistema de puesta a tierra verificado?', critical: false }
  ],
  CONFINADO: [
    { id: 'atmosphere_monitored', label: '¿Monitoreo de atmósfera realizado?', critical: true },
    { id: 'has_entry_permit', label: '¿Permiso de entrada vigente?', critical: true },
    { id: 'has_rescue_team', label: '¿Equipo de rescate disponible?', critical: true }
  ],
  CALIENTE: [
    { id: 'has_fire_extinguisher', label: '¿Extintor disponible y cargado?', critical: true },
    { id: 'has_heat_shield', label: '¿Manta ignífuga instalada?', critical: false },
    { id: 'gas_monitoring', label: '¿Monitoreo de gases inflamables?', critical: true }
  ]
};

const SafetyChecklist = ({ riskType, safetyChecks, onChange }) => {
  const checks = SAFETY_CHECKS[riskType] || [];

  const handleChange = (checkId, value) => {
    onChange({ ...safetyChecks, [checkId]: value });
  };

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        Lista de Verificación de Seguridad
      </h3>
      
      {checks.map(check => (
        <label
          key={check.id}
          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
            check.critical && safetyChecks[check.id] === false
              ? 'bg-red-50 border-l-4 border-red-600'
              : 'hover:bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={safetyChecks[check.id] || false}
            onChange={(e) => handleChange(check.id, e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <div className="flex-1">
            <span className={`font-medium ${check.critical ? 'text-red-800' : 'text-gray-700'}`}>
              {check.label}
              {check.critical && <span className="ml-2 text-xs text-red-600">(CRÍTICO)</span>}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default SafetyChecklist;
