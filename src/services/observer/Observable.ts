import type { IObserver, IObservable, ObservableEvent } from './IObserver';

export abstract class Observable implements IObservable {
    protected observers: Set<IObserver> = new Set();

    attach(observer: IObserver): void {
        this.observers.add(observer);
        console.log(`[Observable] Observador registrado. Total: ${this.observers.size}`);
    }

    detach(observer: IObserver): void {
        this.observers.delete(observer);
        console.log(`[Observable] Observador removido. Total: ${this.observers.size}`);
    }

    notifyObservers(event: ObservableEvent): void {
        console.log(
            `[Observable] Notificando ${this.observers.size} observadores sobre evento: ${event.type}`
        );

        this.observers.forEach(observer => {
            try {
                observer.update(event);
            } catch (error) {
                console.error(`[Observable] Error al notificar observador:`, error);
            }
        });
    }

    getObserverCount(): number {
        return this.observers.size;
    }
}
