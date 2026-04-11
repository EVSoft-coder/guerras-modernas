/**
 * Logger.ts
 * Subsistema de telemetria e registo tático.
 */
export class Logger {
    public static info(message: string): void {
        console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
    }
 
    public static warn(message: string): void {
        console.warn(`[WARN] [${new Date().toISOString()}] ${message}`);
    }
 
    public static error(message: string, error?: any): void {
        console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error);
    }
 
    /**
     * Registo especializado para eventos do EventBus.
     */
    public static event(type: string, payload: any): void {
        // Apenas registamos em modo debug ou se for crítico
        // console.log(`[EVENT] [${type}]`, payload);
    }
}
