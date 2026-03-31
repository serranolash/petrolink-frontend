import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, MapPin, Loader2, AlertCircle } from 'lucide-react';

const SignaturePad = ({ onSave, signerName, signerType, disabled, permitId }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [saved, setSaved] = useState(false);

    // Inicializar canvas
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
            canvas.height = 180;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 2;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Obtener ubicación GPS
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

    // Eventos de dibujo
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
    };

    const handleSave = async () => {
        if (!signatureData) {
            alert('Por favor, firma antes de continuar');
            return;
        }
        
        if (!location && !locationError) {
            await getLocation();
            setTimeout(() => {
                if (location) {
                    saveSignature();
                } else {
                    alert('Es necesario obtener la ubicación GPS para firmar');
                }
            }, 2000);
        } else if (location) {
            saveSignature();
        } else {
            alert('Error de ubicación: ' + locationError);
        }
    };

    const saveSignature = () => {
        const signaturePayload = {
            signatureData,
            signerName,
            signerType,
            location: location || null,
            permitId,
            timestamp: new Date().toISOString(),
            deviceInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            }
        };
        
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
                        style={{ width: '100%', height: '180px', touchAction: 'none' }}
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
                        disabled={disabled || saved}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4" />
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
                                Ubicación verificada: {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
                                {location.accuracy && ` (±${Math.round(location.accuracy)}m)`}
                            </span>
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
            </div>
        </div>
    );
};

export default SignaturePad;