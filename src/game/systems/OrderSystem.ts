/**
 * src/game/systems/OrderSystem.ts
 * Centro de Comando com SinalizaÃ§Ã£o Normalizada.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { TargetComponent, SelectionComponent } from '../components/BaseComponents';
import { GameSystem } from './types';
 
export class OrderSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] OrderSystem - Tactical Downlink ACTIVE.');
        window.addEventListener('mousedown', this.handleMouseClick.bind(this));
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        // LÃ³gica de pulso (opcional)
    }
 
    private handleMouseClick(e: MouseEvent): void {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
 
        if (e.button === 0) {
            this.processSelection(mouseX, mouseY);
        } else if (e.button === 2) {
            this.processMoveOrder(mouseX, mouseY);
        }
    }
 
    private processSelection(x: number, y: number): void {
        const entities = entityManager.getEntitiesWith(['Position', 'Sprite']);
        let found = false;
        const selected = entityManager.getEntitiesWith(['Selection']);
        selected.forEach(id => entityManager.removeComponent(id, 'Selection'));
 
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
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        window.removeEventListener('mousedown', this.handleMouseClick);
        console.log('[SYSTEM] OrderSystem - Tactical Downlink Offline.');
    }
}
 
export const orderSystem = new OrderSystem();
