// client/src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
    BarChart3, CheckCircle, XCircle, FileText, RefreshCw, Calendar, 
    TrendingUp, Camera, PenTool, MapPin, Image, Clock, UserCheck, UserX,
    Navigation, AlertCircle, Globe
} from 'lucide-react';

const API_BASE_URL = 'https://petrolink-backend-production.up.railway.app/api';

const Dashboard = ({ token, userRole }) => {
  const [stats, setStats] = useState(null);
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPermitForAction, setSelectedPermitForAction] = useState(null);
  const [supervisorSignature, setSupervisorSignature] = useState(null);

  const fetchData = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      const permitsResponse = await fetch(`${API_BASE_URL}/permits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const permitsData = await permitsResponse.json();
      if (permitsData.success) {
        setPermits(permitsData.permits || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleApprove = async () => {
    if (!supervisorSignature) {
      alert('Por favor, firma para aprobar el permiso');
      return;
    }
    
    setProcessingAction(true);
    try {
      const response = await fetch(`${API_BASE_URL}/permits/${selectedPermitForAction}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'approve',
          supervisor_signature: supervisorSignature
        })
      });
      const data = await response.json();
      if (data.success) {
        if (data.pdf) {
          const link = document.createElement('a');
          link.href = 'data:application/pdf;base64,' + data.pdf;
          link.download = 'permiso-aprobado-' + data.permit.permit_number + '.pdf';
          link.click();
        }
        fetchData();
        setShowApproveModal(false);
        setSupervisorSignature(null);
        setSelectedPermitForAction(null);
        alert('Permiso aprobado correctamente');
      } else {
        alert(data.error || 'Error al aprobar');
      }
    } catch (error) {
      alert('Error al aprobar el permiso');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Por favor ingresa un motivo de rechazo');
      return;
    }
    
    setProcessingAction(true);
    try {
      const response = await fetch(`${API_BASE_URL}/permits/${selectedPermitForAction}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'reject',
          rejection_reason: rejectionReason 
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchData();
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedPermitForAction(null);
        alert('Permiso rechazado');
      } else {
        alert(data.error || 'Error al rechazar');
      }
    } catch (error) {
      alert('Error al rechazar el permiso');
    } finally {
      setProcessingAction(false);
    }
  };

  const getRiskIcon = (riskType) => {
    const icons = { ALTURA: '📈', ELECTRICO: '⚡', CONFINADO: '🚪', CALIENTE: '🔥' };
    return icons[riskType] || '📋';
  };

  const getRiskLabel = (riskType) => {
    const labels = { 
      ALTURA: 'Trabajo en Altura', 
      ELECTRICO: 'Riesgo Eléctrico', 
      CONFINADO: 'Espacio Confinado', 
      CALIENTE: 'Trabajo en Caliente' 
    };
    return labels[riskType] || riskType;
  };

  const getRiskColor = (riskType) => {
    const colors = {
      ALTURA: 'bg-orange-100 text-orange-800',
      ELECTRICO: 'bg-yellow-100 text-yellow-800',
      CONFINADO: 'bg-blue-100 text-blue-800',
      CALIENTE: 'bg-red-100 text-red-800'
    };
    return colors[riskType] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle className="w-3 h-3" />;
      case 'REJECTED': return <XCircle className="w-3 h-3" />;
      case 'PENDING': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'APPROVED': return 'Aprobado';
      case 'REJECTED': return 'Rechazado';
      case 'PENDING': return 'Pendiente';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  const canApprove = (userRole === 'admin' || userRole === 'supervisor');

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="bg-green-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Energy-Compliance</h1>
              <p className="text-green-200 text-sm">Dashboard de Permisos</p>
            </div>
            <button
              onClick={fetchData}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Permisos</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.total_permits || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">{stats?.approved_permits || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rechazados</p>
              <p className="text-3xl font-bold text-red-600">{stats?.rejected_permits || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pending_permits || 0}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {stats?.total_permits > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Tasa de Aprobación
            </h3>
            <span className="text-2xl font-bold text-green-600">
              {((stats.approved_permits / stats.total_permits) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${(stats.approved_permits / stats.total_permits) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Historial de Permisos
          </h3>
        </div>

        {permits.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay permisos generados aún</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {permits.map((permit) => (
              <div
                key={permit.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedPermit(selectedPermit?.id === permit.id ? null : permit)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getRiskIcon(permit.risk_type)}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{permit.permit_number}</p>
                      <p className="text-sm text-gray-500">{permit.technician_name}</p>
                      <p className="text-xs text-gray-400">Creado por: {permit.created_by_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {permit.photos_count > 0 && <Image className="w-3 h-3 text-purple-500" />}
                      {permit.technician_signature && <PenTool className="w-3 h-3 text-blue-500" />}
                      {permit.supervisor_signature && <CheckCircle className="w-3 h-3 text-green-500" />}
                      {permit.work_latitude && <MapPin className="w-3 h-3 text-cyan-500" />}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(permit.risk_type)}`}>
                      {getRiskLabel(permit.risk_type)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(permit.status)}`}>
                      {getStatusIcon(permit.status)}
                      {getStatusText(permit.status)}
                    </span>
                  </div>
                </div>

                {selectedPermit?.id === permit.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Supervisor</p>
                        <p className="font-medium">{permit.supervisor_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ubicación</p>
                        <p className="font-medium">{permit.work_location}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Descripción</p>
                        <p className="text-gray-700">{permit.work_description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Creación</p>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(permit.created_at)}
                        </p>
                      </div>
                    </div>

                    {(permit.work_latitude || permit.work_longitude) && (
                      <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-cyan-600" />
                          Ubicación del Trabajo (Geocerca)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Coordenadas</p>
                            <p className="font-mono text-xs">
                              📍 {parseFloat(permit.work_latitude).toFixed(6)}°, {parseFloat(permit.work_longitude).toFixed(6)}°
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Radio de tolerancia</p>
                            <p className="font-medium">📏 {permit.work_radius || 100} metros</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {permit.technician_signature && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <PenTool className="w-4 h-4" />
                          Firma del Técnico
                        </h4>
                        <div className="border rounded-lg p-3 bg-white">
                          <p className="text-sm font-medium">{permit.technician_signature.signerName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(permit.technician_signature.timestamp)}
                          </p>
                          {permit.technician_signature.signatureData && (
                            <div className="mt-2 flex justify-center">
                              <img src={permit.technician_signature.signatureData} alt="Firma Técnico" className="h-16 object-contain" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {permit.supervisor_signature && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          Firma del Supervisor
                        </h4>
                        <div className="border rounded-lg p-3 bg-white">
                          <p className="text-sm font-medium">{permit.supervisor_signature.signerName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(permit.supervisor_signature.timestamp)}
                          </p>
                          {permit.supervisor_signature.signatureData && (
                            <div className="mt-2 flex justify-center">
                              <img src={permit.supervisor_signature.signatureData} alt="Firma Supervisor" className="h-16 object-contain" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {permit.photos && permit.photos.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Evidencia Fotográfica ({permit.photos.length} foto(s))
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {permit.photos.map((photo, idx) => (
                            <img
                              key={photo.id || idx}
                              src={photo.data}
                              alt={`Evidencia ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 hover:border-purple-400"
                              onClick={(e) => { e.stopPropagation(); setExpandedPhoto(photo); }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {canApprove && permit.status === 'PENDING' && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPermitForAction(permit.id);
                            setShowApproveModal(true);
                          }}
                          disabled={processingAction}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar y Firmar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPermitForAction(permit.id);
                            setShowRejectModal(true);
                          }}
                          disabled={processingAction}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Aprobar Permiso</h3>
            <p className="text-sm text-gray-600 mb-4">Firma como supervisor para aprobar este permiso</p>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={!supervisorSignature || processingAction}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processingAction ? 'Procesando...' : 'Firmar y Aprobar'}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSupervisorSignature(null);
                  setSelectedPermitForAction(null);
                }}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Rechazar Permiso</h3>
            <textarea
              placeholder="Motivo del rechazo..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processingAction}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Rechazar
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedPermitForAction(null);
                }}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {expandedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setExpandedPhoto(null)}>
          <div className="max-w-3xl max-h-screen">
            <img src={expandedPhoto.data} alt="Foto expandida" className="max-w-full max-h-screen object-contain" />
            <button className="absolute top-4 right-4 bg-white rounded-full p-2" onClick={() => setExpandedPhoto(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;