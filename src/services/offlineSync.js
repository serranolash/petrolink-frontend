// client/src/services/offlineSync.js
import { openDB } from 'idb';
import API_URL from '../config/api';

class OfflineSyncService {
    constructor() {
        this.db = null;
        this.syncInterval = null;
        this.initDB();
        this.setupOnlineListener();
    }

    async initDB() {
        this.db = await openDB('EnergyComplianceDB', 1, {
            upgrade(db) {
                // Store para permisos pendientes
                if (!db.objectStoreNames.contains('pendingPermits')) {
                    const permitStore = db.createObjectStore('pendingPermits', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    permitStore.createIndex('createdAt', 'createdAt');
                    permitStore.createIndex('status', 'status');
                }
                
                // Store para firmas pendientes
                if (!db.objectStoreNames.contains('pendingSignatures')) {
                    const signatureStore = db.createObjectStore('pendingSignatures', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    signatureStore.createIndex('createdAt', 'createdAt');
                    signatureStore.createIndex('permitId', 'permitId');
                }
                
                // Store para fotos pendientes
                if (!db.objectStoreNames.contains('pendingPhotos')) {
                    const photoStore = db.createObjectStore('pendingPhotos', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    photoStore.createIndex('createdAt', 'createdAt');
                    photoStore.createIndex('permitId', 'permitId');
                }
                
                // Store para caché de formularios
                if (!db.objectStoreNames.contains('formCache')) {
                    db.createObjectStore('formCache', { keyPath: 'riskType' });
                }
            }
        });
        
        // Cachear formularios activos
        await this.cacheActiveForms();
    }

    setupOnlineListener() {
        window.addEventListener('online', () => {
            console.log('Conexión restaurada, iniciando sincronización...');
            this.syncAllPendingData();
        });
    }

    async cacheActiveForms() {
        try {
            const response = await fetch(`${API_URL}/forms/active`);
            const forms = await response.json();
            
            const tx = this.db.transaction('formCache', 'readwrite');
            const store = tx.objectStore('formCache');
            
            for (const form of forms) {
                await store.put(form);
            }
            
            await tx.done;
        } catch (error) {
            console.log('Offline: usando formularios cacheados');
        }
    }

    async savePermitOffline(permitData) {
        const permit = {
            ...permitData,
            status: 'PENDING_SYNC',
            createdAt: new Date().toISOString(),
            syncAttempts: 0
        };
        
        const tx = this.db.transaction('pendingPermits', 'readwrite');
        const store = tx.objectStore('pendingPermits');
        const id = await store.add(permit);
        await tx.done;
        
        // Registrar para sincronización
        this.registerForSync();
        
        return id;
    }

    async savePhotoOffline(photoData, permitId) {
        const photo = {
            ...photoData,
            permitId,
            createdAt: new Date().toISOString(),
            syncAttempts: 0
        };
        
        const tx = this.db.transaction('pendingPhotos', 'readwrite');
        const store = tx.objectStore('pendingPhotos');
        const id = await store.add(photo);
        await tx.done;
        
        return id;
    }

    async syncAllPendingData() {
        await this.syncPendingPermits();
        await this.syncPendingPhotos();
        await this.syncPendingSignatures();
    }

    async syncPendingPermits() {
        const tx = this.db.transaction('pendingPermits', 'readonly');
        const store = tx.objectStore('pendingPermits');
        const pendingPermits = await store.getAll();
        await tx.done;
        
        for (const permit of pendingPermits) {
            try {
                const response = await fetch(`${API_URL}/permits/offline`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(permit)
                });
                
                if (response.ok) {
                    // Eliminar local si se sincronizó
                    const deleteTx = this.db.transaction('pendingPermits', 'readwrite');
                    await deleteTx.objectStore('pendingPermits').delete(permit.id);
                    await deleteTx.done;
                    
                    console.log(`Permiso ${permit.id} sincronizado correctamente`);
                } else {
                    await this.incrementSyncAttempts('pendingPermits', permit.id);
                }
            } catch (error) {
                console.error(`Error sincronizando permiso ${permit.id}:`, error);
                await this.incrementSyncAttempts('pendingPermits', permit.id);
            }
        }
    }

    async syncPendingPhotos() {
        const tx = this.db.transaction('pendingPhotos', 'readonly');
        const store = tx.objectStore('pendingPhotos');
        const pendingPhotos = await store.getAll();
        await tx.done;
        
        for (const photo of pendingPhotos) {
            try {
                const formData = new FormData();
                formData.append('photo', photo.blob, photo.filename);
                formData.append('permitId', photo.permitId);
                formData.append('metadata', JSON.stringify(photo.metadata));
                
                const response = await fetch(`${API_URL}/photos/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const deleteTx = this.db.transaction('pendingPhotos', 'readwrite');
                    await deleteTx.objectStore('pendingPhotos').delete(photo.id);
                    await deleteTx.done;
                }
            } catch (error) {
                console.error(`Error sincronizando foto ${photo.id}:`, error);
            }
        }
    }

    async getCachedForm(riskType) {
        const tx = this.db.transaction('formCache', 'readonly');
        const store = tx.objectStore('formCache');
        const form = await store.get(riskType);
        await tx.done;
        return form;
    }

    registerForSync() {
        // Registrar para sync periódico si está offline
        if (!this.syncInterval && !navigator.onLine) {
            this.syncInterval = setInterval(() => {
                if (navigator.onLine) {
                    this.syncAllPendingData();
                    clearInterval(this.syncInterval);
                    this.syncInterval = null;
                }
            }, 30000); // Reintentar cada 30 segundos
        }
    }

    async incrementSyncAttempts(storeName, id) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const item = await store.get(id);
        
        if (item) {
            item.syncAttempts = (item.syncAttempts || 0) + 1;
            // Si supera 5 intentos, marcar como error
            if (item.syncAttempts >= 5) {
                item.status = 'SYNC_FAILED';
            }
            await store.put(item);
        }
        
        await tx.done;
    }
}

export default new OfflineSyncService();