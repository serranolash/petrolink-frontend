// client/src/components/common/SignaturePad.jsx
import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, MapPin, Loader2, AlertCircle, Navigation } from 'lucide-react';
import geofenceService from '../../services/geofenceService';

const SignaturePad = ({ onSave, signerName, signerType, disabled, workLocationCoords, workRadius = 100, permitId }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [location, setLocation] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [saved, setSaved] = useState(false);
    const [validation, setValidation] = useState(null);
    const [validating, setValidating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = 150;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 2;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const getLocation = () => {
        setGettingLocation(true);
        setLocationError(null);
        
        if (!navigator.geolocation) {
            setLocationError('GPS no disponible en este dispositivo');
            setGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
                setGettingLocation(false);
            },
            (error) => {
                let errorMsg = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Permiso de ubicación denegado. Es obligatorio para firmar.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Ubicación no disponible. Verifica tu GPS.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Tiempo de espera agotado. Reintenta.';
                        break;
                    default:
                        errorMsg = 'Error al obtener ubicación.';
                }
                setLocationError(errorMsg);
                setGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    const validateLocationWithServer = async () => {
        if (!location) return false;
        
        if (!workLocationCoords || !workLocationCoords.latitude) {
            setValidation({
                valid: true,
                distance: 0,
                message: '⚠️ Sin geocerca configurada - no se valida ubicación',
                canSign: true
            });
            return true;
        }
        
        setValidating(true);
        
        try {
            const result = await geofenceService.validateLocation(permitId, location);
            
            if (result.success && result.validation) {
                const validationData = result.validation;
                setValidation({
                    valid: validationData.within_geofence,
                    distance: validationData.distance_meters,  // ← GUARDA LA DISTANCIA
                    message: validationData.message,
                    canSign: validationData.within_geofence
                });
                return validationData.within_geofence;
            } else {
                // Fallback a cálculo local
                const distance = geofenceService.calculateDistance(
                    location.latitude,
                    location.longitude,
                    workLocationCoords.latitude,
                    workLocationCoords.longitude
                );
                const effectiveRadius = workRadius + (location.accuracy || 0);
                const isValid = distance <= effectiveRadius;
                
                setValidation({
                    valid: isValid,
                    distance: distance,  // ← GUARDA LA DISTANCIA
                    message: isValid 
                        ? `✅ Dentro del área (${Math.round(distance)}m, tolerancia ${Math.round(effectiveRadius)}m)`
                        : `❌ Fuera del área (${Math.round(distance)}m, máximo permitido ${Math.round(effectiveRadius)}m)`,
                    canSign: isValid
                });
                return isValid;
            }
        } catch (error) {
            console.error('Error validando geocerca:', error);
            // Fallback a cálculo local
            const distance = geofenceService.calculateDistance(
                location.latitude,
                location.longitude,
                workLocationCoords.latitude,
                workLocationCoords.longitude
            );
            const effectiveRadius = workRadius + (location.accuracy || 0);
            const isValid = distance <= effectiveRadius;
            
            setValidation({
                valid: isValid,
                distance: distance,  // ← GUARDA LA DISTANCIA
                message: isValid 
                    ? `✅ Dentro del área (${Math.round(distance)}m, tolerancia ${Math.round(effectiveRadius)}m)`
                    : `❌ Fuera del área (${Math.round(distance)}m, máximo permitido ${Math.round(effectiveRadius)}m)`,
                canSign: isValid
            });
            return isValid;
        } finally {
            setValidating(false);
        }
    };

    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const point = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const point = getCoordinates(e);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const signature = canvas.toDataURL();
        setSignatureData(signature);
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: Math.max(0, Math.min(canvas.width, (clientX - rect.left) * scaleX)),
            y: Math.max(0, Math.min(canvas.height, (clientY - rect.top) * scaleY))
        };
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setSignatureData(null);
        setSaved(false);
        setValidation(null);
    };

    const handleSave = async () => {
        if (!signatureData) {
            alert('Por favor, firma antes de continuar');
            return;
        }
        
        if (!location && !locationError) {
            await getLocation();
            setTimeout(async () => {
                if (location) {
                    const isValid = await validateLocationWithServer();
                    if (isValid) {
                        saveSignature();
                    } else {
                        alert(validation?.message || 'No puedes firmar desde esta ubicación');
                    }
                } else {
                    alert('Es necesario obtener la ubicación GPS para firmar');
                }
            }, 2000);
        } else if (location) {
            const isValid = await validateLocationWithServer();
            if (isValid) {
                saveSignature();
            } else {
                alert(validation?.message || 'No puedes firmar desde esta ubicación');
            }
        } else {
            alert('Error de ubicación: ' + locationError);
        }
    };

    const saveSignature = () => {
        // Crear el objeto en el formato que espera el backend
        const signaturePayload = {
            signatureData: signatureData,  // La imagen
            signerName: signerName,
            signerType: signerType,
            timestamp: new Date().toISOString(),
            location: location || null,
            // Agregar los campos de validación DIRECTAMENTE en el objeto principal
            is_within_geofence: validation ? validation.valid : null,
            distance_to_work_meters: validation ? validation.distance : null,
            timestamp: new Date().toISOString()
        };
        
        // Log para depurar
        console.log('💾 Guardando firma:', {
            tieneImagen: !!signatureData,
            tamanoImagen: signatureData?.length,
            ubicacion: !!location,
            dentroGeocerca: validation?.valid
        });
        
        onSave(signaturePayload);
        setSaved(true);
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-blue-600" />
                        Firma de {signerType === 'TECHNICIAN' ? 'Técnico de Campo' : 'Supervisor de Seguridad'}
                    </h3>
                    {saved && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            ✓ Firmado
                        </span>
                    )}
                </div>
                
                {/* Área de firma */}
                <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        style={{ width: '100%', height: '150px', touchAction: 'none' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
                
                {/* Botones */}
                <div className="flex gap-2 mt-3">
                    <button
                        type="button"
                        onClick={clearSignature}
                        disabled={saved}
                        className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Limpiar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={disabled || saved || validating}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {validating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        {saved ? 'Firmado' : 'Firmar'}
                    </button>
                </div>
                
                {/* Estado de ubicación */}
                <div className="mt-3 text-sm">
                    {gettingLocation && (
                        <div className="flex items-center gap-2 text-yellow-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Obteniendo ubicación GPS...</span>
                        </div>
                    )}
                    {location && !gettingLocation && (
                        <div className="flex items-center gap-2 text-green-600">
                            <MapPin className="w-4 h-4" />
                            <span>
                                Ubicación: {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
                                {location.accuracy && ` (±${Math.round(location.accuracy)}m)`}
                            </span>
                        </div>
                    )}
                    {validating && (
                        <div className="flex items-center gap-2 text-blue-600 mt-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Validando ubicación con el servidor...</span>
                        </div>
                    )}
                    {validation && !validating && !gettingLocation && (
                        <div className={`mt-2 p-2 rounded ${validation.valid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {validation.message}
                        </div>
                    )}
                    {locationError && !gettingLocation && (
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>{locationError}</span>
                            <button
                                onClick={getLocation}
                                className="ml-2 text-blue-600 underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Indicador de geocerca configurada */}
                {workLocationCoords && workLocationCoords.latitude && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>Área de trabajo configurada: radio {workRadius}m</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignaturePad;