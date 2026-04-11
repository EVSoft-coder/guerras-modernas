/**
 * src/game/systems/RenderSystem.ts
 * Motor de Renderização Digital (Canvas 2D).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';
 
export class RenderSystem implements GameSystem {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private images: Map<string, HTMLImageElement> = new Map();
 
    public init(): void {
        console.log('[SYSTEM] RenderSystem - Initializing Visual Canvas...');
        this.createCanvas();
    }
 
    private createCanvas(): void {
        // Criar um canvas que cubra o dashboard (ou zona táctica)
        const canvas = document.createElement('canvas');
        canvas.id = 'battle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '50'; // Por baixo do HUD, mas acima do fundo
        canvas.style.pointerEvents = 'none'; // Importante para não bloquear a UI base
        
        // Ajustar resolução
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
 
    public update(deltaTime: number): void {
        if (!this.ctx || !this.canvas) return;
 
        // 1. Limpar Quadrante
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
        // 2. Obter Entidades com Componentes de Visualização
        const entities = entityManager.getEntitiesWith(['Position', 'Sprite']);
 
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'Position');
            const sprite = entityManager.getComponent<any>(entityId, 'Sprite');
            const health = entityManager.getComponent<any>(entityId, 'Health');
            const isSelected = entityManager.getComponent<any>(entityId, 'Selection');
            
            this.drawEntity(pos, sprite, health, isSelected);
        }
    }
 
    private drawEntity(pos: any, sprite: any, health: any, isSelected: any): void {
        if (!this.ctx) return;
 
        let img = this.images.get(sprite.imagePath);
        
        if (!img) {
            img = new Image();
            img.src = sprite.imagePath;
            this.images.set(sprite.imagePath, img);
        }
 
        if (img.complete) {
            const size = 64;
            
            // 1. Desenhar Highlight de Selecção se activo
            if (isSelected) {
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, size/2 + 5, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#00ff00';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
                this.ctx.fill();
            }
 
            // 2. Desenhar Sprite
            this.ctx.drawImage(img, pos.x - size/2, pos.y - size/2, size, size);
            
            // 3. Desenhar Barra de Vida
            if (health) {
                const barWidth = 50;
                const barHeight = 4;
                const healthPercent = health.value / health.max;
                
                // Fundo (Vermelho)
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(pos.x - barWidth/2, pos.y - size/2 - 10, barWidth, barHeight);
                
                // Valor Atual (Verde)
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(pos.x - barWidth/2, pos.y - size/2 - 10, barWidth * healthPercent, barHeight);
            }
        }
    }
 
    public destroy(): void {
        if (this.canvas) {
            document.body.removeChild(this.canvas);
        }
    }
}
 
export const renderSystem = new RenderSystem();
