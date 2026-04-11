/**
 * src/core/Logger.ts
 * Central de Telemetria Táctica.
 */
export const LoggerConfig = {
    ENABLED: true, // Interruptor Global
    VERBOSE_EVENTS: true,
    VERBOSE_SYSTEMS: false // Desativado por padrão para evitar spam de 60fps
};
 
export const Logger = {
    event: (type: string, data: any) => {
        if (!LoggerConfig.ENABLED || !LoggerConfig.VERBOSE_EVENTS) return;
        console.log(`[EVENT] %c${type}`, 'color: #00ff00; font-weight: bold;', data);
    },
    
    system: (msg: string) => {
        if (!LoggerConfig.ENABLED || !LoggerConfig.VERBOSE_SYSTEMS) return;
        console.log(`[SYSTEM] %c${msg}`, 'color: #00aaff;');
    },
 
    info: (msg: string) => {
        if (!LoggerConfig.ENABLED) return;
        console.info(`[INFO] ${msg}`);
    },
 
    error: (msg: string, err?: any) => {
        console.error(`[ERROR] ${msg}`, err);
    }
};
