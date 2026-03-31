import React, { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import SignaturePad from '../common/SignaturePad';
import PhotoEvidence from '../common/PhotoEvidence';
import API_URL from '../config/api';

const RISK_TYPES = [
  { value: 'ALTURA', label: 'Trabajo en Altura', icon: '📈' },
  { value: 'ELECTRICO', label: 'Riesgo Eléctrico', icon: '⚡' },
  { value: 'CONFINADO', label: 'Espacio Confinado', icon: '🚪' },
  { value: 'CALIENTE', label: 'Trabajo en Caliente', icon: '🔥' }
];

const SAFETY_CHECKS = {
  ALTURA: [
    { id: 'has_harness', label: '¿Cuenta con arnés de seguridad certificado?', critical: true },
    { id: 'has_anchor_point', label: '¿Punto de anclaje certificado?', critical: true }
  ],
  ELECTRICO: [
    { id: 'has_dielectric_ppe', label: '¿Cuenta con EPP dieléctrico completo?', critical: true },
    { id: 'voltage_test_performed', label: '¿Prueba de ausencia de tensión realizada?', critical: true }
  ],
  CONFINADO: [
    { id: 'atmosphere_monitored', label: '¿Monitoreo de atmósfera realizado?', critical: true },
    { id: 'has_entry_permit', label: '¿Permiso de entrada vigente?', critical: true },
    { id: 'has_rescue_team', label: '¿Equipo de rescate disponible?', critical: true }
  ],
  CALIENTE: [
    { id: 'has_fire_extinguisher', label: '¿Extintor disponible y cargado?', critical: true },
    { id: 'gas_monitoring', label: '¿Monitoreo de gases inflamables?', critical: true }
  ]
};

const PTForm = ({ onSubmitSuccess, token, userRole, currentUser }) => {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [safetyChecks, setSafetyChecks] = useState({});
  const [technicianName, setTechnicianName] = useState(currentUser?.full_name || '');
  const [supervisorName, setSupervisorName] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [safetyMessage, setSafetyMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [technicianSignature, setTechnicianSignature] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Si es técnico, pre-llenar el nombre y deshabilitar el campo
  const isTechnician = userRole === 'technician';
  const isSupervisor = userRole === 'supervisor';
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (isTechnician && currentUser?.full_name) {
      setTechnicianName(currentUser.full_name);
    }
  }, [isTechnician, currentUser]);

  const checkSafety = () => {
    if (!selectedRisk) return false;
    const criticalChecks = SAFETY_CHECKS[selectedRisk] || [];
    const failedCritical = criticalChecks.some(check => safetyChecks[check.id] !== true);
    if (failedCritical) {
      setSafetyMessage('⚠️ TRABAJO NO SEGURO: Faltan requisitos críticos de seguridad');
      return false;
    }
    setSafetyMessage('✅ TRABAJO SEGURO: Todos los requisitos críticos cumplidos');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedRisk) {
      alert('Por favor selecciona un tipo de riesgo');
      return;
    }
    if (currentStep === 2 && !checkSafety()) return;
    if (currentStep === 3 && photos.length === 0) {
      alert('Adjunta al menos una foto como evidencia');
      return;
    }
    if (currentStep === 4 && !technicianSignature) {
      alert('El técnico debe firmar el permiso');
      return;
    }
    if (currentStep === 5 && (!technicianName || !supervisorName || !workLocation || !workDescription)) {
      alert('Completa todos los campos');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => setCurrentStep(currentStep - 1);
  const handleTechnicianSignature = (data) => setTechnicianSignature(data);
  const handlePhotoCapture = (photo) => setPhotos(prev => [...prev, photo]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/permits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          risk_type: selectedRisk,
          safety_checks: safetyChecks,
          technician_name: technicianName,
          supervisor_name: supervisorName,
          work_location: workLocation,
          work_description: workDescription,
          technician_signature: technicianSignature,
          photos: photos.map(p => ({ id: p.id, data: p.data }))
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear permiso');
      }
      
      // Generar PDF básico
      if (data.pdf) {
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,' + data.pdf;
        link.download = 'solicitud-permiso-' + data.permit.permit_number + '.pdf';
        link.click();
      }
      
      onSubmitSuccess?.(data);
      
      setSelectedRisk(null);
      setSafetyChecks({});
      setTechnicianName(isTechnician ? currentUser?.full_name || '' : '');
      setSupervisorName('');
      setWorkLocation('');
      setWorkDescription('');
      setSafetyMessage(null);
      setTechnicianSignature(null);
      setPhotos([]);
      setCurrentStep(1);
      
      alert(data.requiresApproval 
        ? '✅ Solicitud de permiso enviada. Espera aprobación del supervisor.'
        : '✅ Permiso generado exitosamente');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el permiso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Riesgo', 'Seguridad', 'Fotos', 'Firma Técnico', 'Datos'];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Energy-Compliance</h1>
              <p className="text-green-200 text-sm">
                {isTechnician && 'Solicitud de Permiso'}
                {isSupervisor && 'Aprobación de Permisos'}
                {isAdmin && 'Administración'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isOffline ? (
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              ) : (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Online
                </span>
              )}
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex-1">
                <div className={`h-1 ${currentStep > index ? 'bg-green-600' : currentStep === index + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className={`text-xs text-center mt-1 ${currentStep === index + 1 ? 'font-bold text-green-600' : 'text-gray-500'}`}>{step}</div>
              </div>
            ))}
          </div>
          
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {RISK_TYPES.map(risk => (
                <button
                  key={risk.value}
                  onClick={() => setSelectedRisk(risk.value)}
                  className={`p-4 border-2 rounded-xl text-center ${selectedRisk === risk.value ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}
                >
                  <span className="text-3xl">{risk.icon}</span>
                  <p className="text-sm mt-1">{risk.label}</p>
                </button>
              ))}
            </div>
          )}
          
          {currentStep === 2 && selectedRisk && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Lista de Verificación de Seguridad
              </h3>
              {SAFETY_CHECKS[selectedRisk].map(check => (
                <label key={check.id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${check.critical && safetyChecks[check.id] === false ? 'bg-red-50 border-l-4 border-red-600' : 'hover:bg-white'}`}>
                  <input
                    type="checkbox"
                    checked={safetyChecks[check.id] || false}
                    onChange={(e) => setSafetyChecks({ ...safetyChecks, [check.id]: e.target.checked })}
                    className="mt-1 w-5 h-5"
                  />
                  <span className={check.critical ? 'text-red-800' : 'text-gray-700'}>
                    {check.label}{check.critical && ' (CRÍTICO)'}
                  </span>
                </label>
              ))}
              {safetyMessage && (
                <div className={`mt-4 p-4 rounded-lg border-l-4 ${safetyMessage.includes('SEGURO') ? 'bg-green-50 text-green-800 border-green-500' : 'bg-red-50 text-red-800 border-red-500'}`}>
                  {safetyMessage}
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <PhotoEvidence onPhotoCaptured={handlePhotoCapture} required={true} maxPhotos={3} />
          )}
          
          {currentStep === 4 && (
            <div className="space-y-6">
              <SignaturePad
                signerName={technicianName || 'Técnico'}
                signerType="TECHNICIAN"
                onSave={handleTechnicianSignature}
              />
            </div>
          )}
          
          {currentStep === 5 && (
            <div className="space-y-4">
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Nombre del Técnico de Campo *"
                disabled={isTechnician}
                className={`w-full p-3 border rounded-lg text-lg ${isTechnician ? 'bg-gray-100 text-gray-600' : ''}`}
              />
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="Nombre del Supervisor *"
                className="w-full p-3 border rounded-lg text-lg"
              />
              <input
                type="text"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                placeholder="Ubicación del Trabajo *"
                className="w-full p-3 border rounded-lg text-lg"
              />
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Descripción detallada del trabajo *"
                rows="4"
                className="w-full p-3 border rounded-lg text-lg"
              />
            </div>
          )}
          
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && <button onClick={handleBack} className="flex-1 py-3 border rounded-lg">← Atrás</button>}
            {currentStep < 5 ? (
              <button onClick={handleNext} className="flex-1 bg-green-600 text-white py-3 rounded-lg">Continuar →</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${safetyMessage?.includes('NO SEGURO') ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'}`}>
                <FileText className="w-5 h-5" />
                {loading ? 'Enviando...' : (isTechnician ? 'Solicitar Permiso' : 'Generar Permiso')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PTForm;