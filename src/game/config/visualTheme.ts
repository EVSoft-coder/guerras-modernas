/**
 * src/game/config/visualTheme.ts
 * Sistema de Identidade Visual Tática - Guerras Modernas
 * Define a paleta, estilo artístico e diretrizes de renderização.
 */

export const visualTheme = {
    metadata: {
        theme: 'Modern Military',
        style: 'Semi-Realistic + RTS Game UI',
        version: '1.0.0'
    },
    
    // Paleta de Cores Operacional
    colors: {
        // Recursos Estratégicos
        metal: {
            base: '#4A4E54', // Cinza Industrial
            light: '#6C727A',
            dark: '#2E3136',
            accent: '#8B949E'
        },
        energy: {
            base: '#00D4FF', // Azul Neon
            light: '#67E8FF',
            dark: '#005D70',
            glow: 'rgba(0, 212, 255, 0.4)'
        },
        petroleum: {
            base: '#1A1A1A', // Preto Profundo
            light: '#FFD700', // Detalhes em Dourado para representar valor/ouro negro
            dark: '#0D0D0D',
            accent: '#B8860B' // Dark Goldenrod
        },
        
        // UI / HUD
        hud: {
            background: 'rgba(5, 10, 15, 0.85)',
            border: '#2A2E33',
            text: '#EFEFEF',
            warning: '#FF4500',
            success: '#32CD32',
            info: '#1E90FF'
        }
    },

    // Diretrizes de Estilo
    typography: {
        fontFamily: "'Inter', 'Roboto Mono', monospace",
        weight: {
            normal: 400,
            bold: 700,
            black: 900
        }
    },

    // Configurações de Ambientação
    gameplay: {
        fogOfWarColor: 'rgba(10, 12, 15, 0.95)',
        gridAlpha: 0.1,
        animationSpeedMod: 1.0
    }
};
