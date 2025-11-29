import type { IWearableConnector } from './adapters/IWearableConnector';
import { GarminAdapter } from './adapters/GarminAdapter';
import { AppleWatchAdapter } from './adapters/AppleWatchAdapter';

export enum WearableDeviceType {
    GARMIN = 'garmin',
    APPLE_WATCH = 'apple_watch',
    FITBIT = 'fitbit',
    SAMSUNG_GALAXY_WATCH = 'samsung_galaxy_watch',
}

export interface WearableConfig {
    type: WearableDeviceType;
    userId: string;
    apiKey?: string;
    apiSecret?: string;
    authToken?: string;
}

export class WearableConnectorFactory {
    private static connectors: Map<string, IWearableConnector> = new Map();

    static createConnector(config: WearableConfig): IWearableConnector {
        const key = `${config.type}-${config.userId}`;

        if (this.connectors.has(key)) {
            return this.connectors.get(key)!;
        }

        let connector: IWearableConnector;

        switch (config.type) {
            case WearableDeviceType.GARMIN:
                connector = new GarminAdapter(
                    config.apiKey || '',
                    config.apiSecret || '',
                    config.userId
                );
                break;

            case WearableDeviceType.APPLE_WATCH:
                connector = new AppleWatchAdapter(config.userId);
                break;

            case WearableDeviceType.FITBIT:
                // Implementar cuando sea necesario
                throw new Error('Fitbit adapter no implementado aún');

            case WearableDeviceType.SAMSUNG_GALAXY_WATCH:
                // Implementar cuando sea necesario
                throw new Error('Samsung Galaxy Watch adapter no implementado aún');

            default:
                throw new Error(`Tipo de dispositivo desconocido: ${config.type}`);
        }

        // Guardar para reutilización
        this.connectors.set(key, connector);

        return connector;
    }

    static getConnector(type: WearableDeviceType, userId: string): IWearableConnector | undefined {
        const key = `${type}-${userId}`;
        return this.connectors.get(key);
    }

    static async removeConnector(type: WearableDeviceType, userId: string): Promise<void> {
        const key = `${type}-${userId}`;
        const connector = this.connectors.get(key);

        if (connector) {
            await connector.disconnect();
            this.connectors.delete(key);
        }
    }

    static listConnectedDevices(): Array<{ type: WearableDeviceType; userId: string }> {
        const devices: Array<{ type: WearableDeviceType; userId: string }> = [];

        this.connectors.forEach((_, key) => {
            const [typeStr, userId] = key.split('-');
            devices.push({
                type: typeStr as WearableDeviceType,
                userId,
            });
        });

        return devices;
    }

    static async disconnectAll(): Promise<void> {
        const promises = Array.from(this.connectors.values()).map(connector =>
            connector.disconnect()
        );

        await Promise.all(promises);
        this.connectors.clear();
    }
}
