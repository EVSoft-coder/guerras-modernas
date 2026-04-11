/**
 * src/game/systems/OrderSystem.ts
 * Centro de Comando com Sinalização Normalizada.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { TargetComponent, SelectionComponent } from '../components/BaseComponents';
import { GameSystem } from '../systemsRegistry';
 
export class OrderSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] OrderSystem - Tactical Downlink ACTIVE.');
        window.addEventListener('mousedown', this.handleMouseClick.bind(this));
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }
 
    private handleMouseClick(e: MouseEvent): void {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
 
        if (e.button === 0) { // ESQUERDO: Selecção
            this.processSelection(mouseX, mouseY);
        } else if (e.button === 2) { // DIREITO: Marcha
            this.processMoveOrder(mouseX, mouseY);
        }
    }
 
    private processSelection(x: number, y: number): void {
        const entities = entityManager.getEntitiesWith(['Position', 'Sprite']);
        let found = false;
 
        // 1. Limpar Selecções
        const selected = entityManager.getEntitiesWith(['Selection']);
        selected.forEach(id => entityManager.removeComponent(id, 'Selection'));
 
        // 2. Novo Target
        for (const id of entities) {
            const pos = entityManager.getComponent<any>(id, 'Position');
            const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
 
            if (dist < 40) {
                entityManager.addComponent(id, new SelectionComponent());
                
                eventBus.emit({
                    type: Events.PLAYER_UNIT_SELECTED,
                    entityId: id,
                    timestamp: Date.now(),
                    data: { x: pos.x, y: pos.y }
                });
                
                found = true;
                break;
            }
        }
 
        if (!found) {
            eventBus.emit({
                type: Events.PLAYER_SELECTION_CLEARED,
                timestamp: Date.now(),
                data: {}
            });
        }
    }
 
    private processMoveOrder(x: number, y: number): void {
        const selected = entityManager.getEntitiesWith(['Selection', 'Position']);
        
        selected.forEach(id => {
            entityManager.addComponent(id, new TargetComponent(x, y));
            
            eventBus.emit({
                type: Events.PLAYER_MOVE_ORDER,
                entityId: id,
                timestamp: Date.now(),
                data: { targetX: x, targetY: y }
            });
        });
    }
 
    public update(deltaTime: number): void {
        // Lógica de pulso
    }
 
    public destroy(): void {
        window.removeEventListener('mousedown', this.handleMouseClick);
    }
}
 
export const orderSystem = new OrderSystem();
