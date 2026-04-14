/**
 * Logger.ts
 * Subsistema de telemetria e registo tático.
 */
export class Logger {
    // Flag de depuração - Definir como true para visibilidade total em dev
    public static DEBUG_MODE = process.env.NODE_ENV === 'development';

    public static info(message: string): void {
        if (!this.DEBUG_MODE) return;
        console.log(`%c[INFO]%c ${message}`, 'color: #0ea5e9; font-weight: bold', 'color: inherit');
    }

    public static warn(message: string): void {
        if (!this.DEBUG_MODE) return;
        console.warn(`[WARN] ${message}`);
    }

    public static error(message: string, error?: any): void {
        console.error(`%c[ERROR]%c ${message}`, 'color: #ef4444; font-weight: bold', 'color: inherit', error);
    }

    public static event(type: string, payload: any): void {
        if (!this.DEBUG_MODE) return;
        console.log(`%c[EVENT]%c [${type}]`, 'color: #8b5cf6; font-weight: bold', 'color: inherit', payload);
    }

    public static backend(action: string, response: any): void {
        if (!this.DEBUG_MODE) return;
        console.log(`%c[BACKEND]%c [${action}]`, 'color: #10b981; font-weight: bold', 'color: inherit', response);
    }

    public static building(action: string, data: any): void {
        if (!this.DEBUG_MODE) return;
        console.log(`%c[BUILDING]%c [${action}]`, 'color: #f59e0b; font-weight: bold', 'color: inherit', data);
    }
}
