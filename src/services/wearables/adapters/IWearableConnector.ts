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

export interface IWearableConnector {
    getConnectionStatus(): ConnectionStatus;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getDeviceInfo(): Promise<WearableDeviceInfo>;
    syncData(): Promise<void>;
    getActivityData(startDate: Date, endDate: Date): Promise<ActivityData[]>;
    getSleepData(startDate: Date, endDate: Date): Promise<SleepData[]>;
    getBiometrics(): Promise<BiometricsData>;
    getTodayActivity(): Promise<ActivityData | null>;
    getDailyStepGoal(): Promise<number>;
    sendCommand(command: string, params?: Record<string, any>): Promise<void>;
    reauthorize(): Promise<void>;
    getLastSyncedActivity(): Promise<ActivityData | null>;
}
