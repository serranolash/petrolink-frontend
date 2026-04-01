// client/src/services/geofenceService.js
import api from './api';

export const geofenceService = {
    // Validar si una ubicación está dentro del área de trabajo
    validateLocation: async (permitId, location) => {
        try {
            const response = await api.post('/signatures/validate', {
                permitId,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: location.accuracy || 0
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error validando geocerca:', error);
            return {
                success: false,
                validation: {
                    within_geofence: false,
                    distance_meters: null,
                    message: 'Error al validar ubicación'
                }
            };
        }
    },

    // Calcular distancia entre dos puntos (función auxiliar)
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371000; // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
};

export default geofenceService;