/**
 * Logger.ts
 * Subsistema de telemetria e registo tático.
 */
export class Logger {
    // Flag de depuração - Definir como true para visibilidade total
    public static DEBUG_MODE = false;

    public static info(message: string): void {
        if (!this.DEBUG_MODE) return;
        console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
    }

    public static warn(message: string): void {
        if (!this.DEBUG_MODE) return;
        console.warn(`[WARN] [${new Date().toISOString()}] ${message}`);
    }

    public static error(message: string, error?: any): void {
        console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error);
    }

    public static event(type: string, payload: any): void {
        if (!this.DEBUG_MODE) return;
        console.log(`[EVENT] [${type}]`, payload);
    }
}
