/**
 * src/game/systems/RenderSystem.ts
 * Motor de RenderizaÃ§Ã£o Digital (Canvas 2D).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
 
export class RenderSystem implements GameSystem {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private images: Map<string, HTMLImageElement> = new Map();
    private frameCount: number = 0;
    private debug: boolean = true; // Ativar para monitorização
 
    public init(): void {
        console.log('[SYSTEM] RenderSystem - Initializing Visual Canvas...');
        this.createCanvas();
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frameCount++;
        
        // Protocolo ECS: Obter todas as entidades com coordenadas
        const entities = entityManager.getEntitiesWith(['Position']);

        if (this.debug && this.frameCount % 60 === 0) {
            console.log("Entities Rendered:", entities.length);
        }

        entities.forEach(entityId => {
            const pos = entityManager.getComponent<any>(entityId, "Position");

            const sprite = entityManager.getComponent<any>(entityId, 'Sprite');
            const health = entityManager.getComponent<any>(entityId, 'Health');
            const isSelected = entityManager.getComponent<any>(entityId, 'Selection');
            
            this.drawEntity(pos, sprite, health, isSelected, entityId);
        });
    }
 
    private createCanvas(): void {
        const canvas = document.createElement('canvas');
        canvas.id = 'battle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '50';
        canvas.style.pointerEvents = 'none';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
 
    private drawEntity(pos: any, sprite: any, health: any, isSelected: any, entityId: number): void {
        if (!this.ctx) return;
        
        const size = 32;
        const isPlayer = entityManager.getComponent<any>(entityId, 'Player');
        const isAI = entityManager.getComponent<any>(entityId, 'AI');

        // 2. BORDA DE SELECÇÃO (Apenas se houver sprite ou for vital)
        if (isSelected) {
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pos.x - size / 2 - 2, pos.y - size / 2 - 2, size + 4, size + 4);
        }
 
        // 3. BARRA DE INTEGRIDADE (HEALTH)
        if (health) {
            const barWidth = 32;
            const barHeight = 4;
            const healthPercent = health.value / health.max;
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(pos.x - barWidth / 2, pos.y - size / 2 - 10, barWidth, barHeight);
            this.ctx.fillStyle = isPlayer ? '#22c55e' : '#ef4444';
            this.ctx.fillRect(pos.x - barWidth / 2, pos.y - size / 2 - 10, barWidth * healthPercent, barHeight);
        }
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
 
export const renderSystem = new RenderSystem();
