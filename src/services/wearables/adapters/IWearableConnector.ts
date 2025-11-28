/**
 * IWearableConnector - Interface para Wearables
 * 
 * Patrón Adapter: Define un contrato común para conectarse a diferentes
 * dispositivos wearable (Garmin, Apple Watch, Fitbit, etc)
 * 
 * Ventajas:
 * - Desacopla la lógica de negocio de implementaciones específicas de wearables
 * - Permite agregar nuevos dispositivos sin modificar código existente
 * - Facilita testing con implementaciones mock
 */

export interface ActivityData {
    date: Date;
    duration: number; // minutos
    caloriesBurned: number;
    distance: number; // km
    heartRateAverage: number;
    steps: number;
    rawData?: Record<string, any>; // Datos específicos del dispositivo
}

export interface SleepData {
    date: Date;
    duration: number; // minutos
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    deepSleep: number; // minutos
    remSleep: number; // minutos
    rawData?: Record<string, any>;
}

export interface BiometricsData {
    timestamp: Date;
    heartRate: number;
    bloodOxygen: number; // %
    temperature: number; // Celsius
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    };
    rawData?: Record<string, any>;
}

export interface WearableDeviceInfo {
    id: string;
    name: string;
    model: string;
    manufacturer: string;
    firmwareVersion: string;
    batteryLevel: number; // 0-100
    lastSync: Date;
}

export enum ConnectionStatus {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    SYNCING = 'syncing',
    ERROR = 'error',
}

/**
 * Interface principal que todos los adaptadores deben implementar
 */
export interface IWearableConnector {
    /**
     * Obtiene el estado actual de conexión
     */
    getConnectionStatus(): ConnectionStatus;

    /**
     * Conecta con el dispositivo wearable
     * @returns Promise que resuelve cuando está conectado
     */
    connect(): Promise<void>;

    /**
     * Desconecta del dispositivo
     */
    disconnect(): Promise<void>;

    /**
     * Obtiene información del dispositivo
     */
    getDeviceInfo(): Promise<WearableDeviceInfo>;

    /**
     * Sincroniza datos del dispositivo
     * @returns Promesa que resuelve cuando finaliza la sincronización
     */
    syncData(): Promise<void>;

    /**
     * Obtiene datos de actividad (pasos, calorías, distancia, etc)
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     */
    getActivityData(startDate: Date, endDate: Date): Promise<ActivityData[]>;

    /**
     * Obtiene datos de sueño
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     */
    getSleepData(startDate: Date, endDate: Date): Promise<SleepData[]>;

    /**
     * Obtiene datos biométricos en tiempo real
     */
    getBiometrics(): Promise<BiometricsData>;

    /**
     * Obtiene actividades de hoy
     */
    getTodayActivity(): Promise<ActivityData | null>;

    /**
     * Obtiene promedio de pasos del día
     */
    getDailyStepGoal(): Promise<number>;

    /**
     * Envía un comando al dispositivo (vibración, notificación, etc)
     */
    sendCommand(command: string, params?: Record<string, any>): Promise<void>;

    /**
     * Revoca permisos y autentica de nuevo
     */
    reauthorize(): Promise<void>;

    /**
     * Obtiene última actividad sincronizada
     */
    getLastSyncedActivity(): Promise<ActivityData | null>;
}
