/**
 * EventBus.ts
 * Barramento de eventos táticos com disciplina estrita de payload.
 */
export interface EventPayload {
    type: string;
    entityId?: number;
    timestamp: number;
    data: any;
}
 
export type TacticalHandler = (payload: EventPayload) => void;
 
class EventBus {
    private handlers: Map<string, TacticalHandler[]> = new Map();
 
    /**
     * Subscreve um manipulador. O eventType é normalizado para UPPER_CASE.
     */
    public subscribe(eventType: string, handler: TacticalHandler): void {
        const type = eventType.toUpperCase();
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type)!.push(handler);
    }
 
    /**
     * Emite um evento através de um payload COMPLETO.
     * Única via de sinalização autorizada.
     */
    public emit(payload: EventPayload): void {
        // Validação Estrita em Runtime
        if (!payload || !payload.type || typeof payload.timestamp !== 'number' || payload.data === undefined) {
            throw new Error(`[EVENT_BUS_FAILURE] Illicit signal detected. Payload must contain {type, timestamp, data}. Received: ${JSON.stringify(payload)}`);
        }
 
        const type = payload.type.toUpperCase();
        const callbacks = this.handlers.get(type);
        
        if (callbacks) {
            callbacks.forEach(cb => cb(payload));
        }
    }
}
 
export const eventBus = new EventBus();
 
// Doutrina de Eventos Pré-definidos
export const Events = {
    UNIT_MOVED: 'UNIT_MOVED',
    UNIT_DAMAGED: 'UNIT_DAMAGED',
    STATE_CHANGED: 'STATE_CHANGED',
    REQUEST_PAUSE: 'REQUEST_PAUSE',
    REQUEST_RESUME: 'REQUEST_RESUME'
};
