/**
 * Adaptador para Garmin Connect API
 * 
 * Adapta la API de Garmin al contrato definido en IWearableConnector
 */

import type {
    IWearableConnector,
    ActivityData,
    SleepData,
    BiometricsData,
    WearableDeviceInfo,
} from './IWearableConnector';
import { ConnectionStatus } from './IWearableConnector';

interface GarminActivityResponse {
    activityId: number;
    activityName: string;
    duration: number;
    distance: number;
    calories: number;
    startTimeInSeconds: number;
    avgHeartRate: number;
    steps: number;
}

interface GarminDevice {
    displayName: string;
    modelDisplayName: string;
    lastUploadTimeInSeconds: number;
    batteryLevel: number;
}

export class GarminAdapter implements IWearableConnector {
    private apiKey: string;
    private apiSecret: string;
    private userId: string;
    private accessToken: string | null = null;
    private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
    private baseUrl = 'https://wellness-api.garmin.com/wellness-api/rest';

    constructor(apiKey: string, apiSecret: string, userId: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.userId = userId;
    }

    getConnectionStatus(): ConnectionStatus {
        return this.connectionStatus;
    }

    async connect(): Promise<void> {
        try {
            this.connectionStatus = ConnectionStatus.CONNECTING;

            // En producción, esto autenticaría con Garmin OAuth
            // Para este ejemplo, asumimos que ya tenemos el token
            if (!this.accessToken) {
                await this.authenticate();
            }

            this.connectionStatus = ConnectionStatus.CONNECTED;
            console.log('[GarminAdapter] Conectado exitosamente');
        } catch (error) {
            this.connectionStatus = ConnectionStatus.ERROR;
            throw new Error(`[GarminAdapter] Error de conexión: ${error}`);
        }
    }

    async disconnect(): Promise<void> {
        this.accessToken = null;
        this.connectionStatus = ConnectionStatus.DISCONNECTED;
        console.log('[GarminAdapter] Desconectado');
    }

    async getDeviceInfo(): Promise<WearableDeviceInfo> {
        await this.ensureConnected();

        // Simulación de respuesta de Garmin
        const response: GarminDevice = {
            displayName: 'Garmin Fenix 6X',
            modelDisplayName: 'fenix 6X',
            lastUploadTimeInSeconds: Date.now() / 1000,
            batteryLevel: 85,
        };

        return {
            id: `garmin-${this.userId}`,
            name: response.displayName,
            model: response.modelDisplayName,
            manufacturer: 'Garmin',
            firmwareVersion: '17.3',
            batteryLevel: response.batteryLevel,
            lastSync: new Date(response.lastUploadTimeInSeconds * 1000),
        };
    }

    async syncData(): Promise<void> {
        await this.ensureConnected();

        this.connectionStatus = ConnectionStatus.SYNCING;
        try {
            // Simular sincronización
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.connectionStatus = ConnectionStatus.CONNECTED;
            console.log('[GarminAdapter] Sincronización completada');
        } catch (error) {
            this.connectionStatus = ConnectionStatus.ERROR;
            throw error;
        }
    }

    async getActivityData(startDate: Date, endDate: Date): Promise<ActivityData[]> {
        await this.ensureConnected();

        // En producción: GET /user/{userId}/activities?startDate={}&endDate={}
        const mockActivities: GarminActivityResponse[] = [
            {
                activityId: 1,
                activityName: 'Running',
                duration: 45,
                distance: 7.5,
                calories: 680,
                startTimeInSeconds: startDate.getTime() / 1000,
                avgHeartRate: 155,
                steps: 6800,
            },
            {
                activityId: 2,
                activityName: 'Cycling',
                duration: 60,
                distance: 25,
                calories: 920,
                startTimeInSeconds: startDate.getTime() / 1000 + 86400, // día siguiente
                avgHeartRate: 140,
                steps: 0,
            },
        ];

        return mockActivities.map(activity => ({
            date: new Date(activity.startTimeInSeconds * 1000),
            duration: activity.duration,
            caloriesBurned: activity.calories,
            distance: activity.distance,
            heartRateAverage: activity.avgHeartRate,
            steps: activity.steps,
            rawData: activity,
        }));
    }

    async getSleepData(startDate: Date, endDate: Date): Promise<SleepData[]> {
        await this.ensureConnected();

        // Simulación de datos de sueño
        return [
            {
                date: startDate,
                duration: 450, // 7.5 horas
                quality: 'good',
                deepSleep: 90,
                remSleep: 120,
            },
            {
                date: new Date(startDate.getTime() + 86400000),
                duration: 480, // 8 horas
                quality: 'excellent',
                deepSleep: 110,
                remSleep: 130,
            },
        ];
    }

    async getBiometrics(): Promise<BiometricsData> {
        await this.ensureConnected();

        return {
            timestamp: new Date(),
            heartRate: 72,
            bloodOxygen: 98,
            temperature: 36.6,
            bloodPressure: {
                systolic: 120,
                diastolic: 80,
            },
        };
    }

    async getTodayActivity(): Promise<ActivityData | null> {
        await this.ensureConnected();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activities = await this.getActivityData(today, new Date());

        return activities.length > 0 ? activities[0] : null;
    }

    async getDailyStepGoal(): Promise<number> {
        await this.ensureConnected();

        return 10000; // Meta diaria típica
    }

    async sendCommand(command: string, params?: Record<string, any>): Promise<void> {
        await this.ensureConnected();

        console.log(
            `[GarminAdapter] Enviando comando: ${command}`,
            params || ''
        );

        // En producción: POST /user/{userId}/device/command
    }

    async reauthorize(): Promise<void> {
        this.accessToken = null;
        await this.authenticate();
    }

    async getLastSyncedActivity(): Promise<ActivityData | null> {
        await this.ensureConnected();

        const activities = await this.getActivityData(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            new Date()
        );

        return activities.length > 0 ? activities[activities.length - 1] : null;
    }

    /**
     * Métodos privados
     */

    private async authenticate(): Promise<void> {
        // En producción, usaría OAuth 2.0 con Garmin
        // Para este ejemplo, simulamos la autenticación
        this.accessToken = `garmin_token_${Date.now()}`;
        console.log('[GarminAdapter] Autenticación completada');
    }

    private async ensureConnected(): Promise<void> {
        if (this.connectionStatus === ConnectionStatus.DISCONNECTED) {
            await this.connect();
        } else if (this.connectionStatus === ConnectionStatus.ERROR) {
            throw new Error('[GarminAdapter] Conexión en estado ERROR');
        }
    }
}
