/**
 * src/game/systems/OrderSystem.ts
 * Gestão de Selecção e Ordens de Marcha.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus } from '../../core/EventBus';
import { TargetComponent, SelectionComponent } from '../components/BaseComponents';
import { GameSystem } from '../systemsRegistry';
 
export class OrderSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] OrderSystem - Tactical Uplink ACTIVE.');
        window.addEventListener('mousedown', this.handleMouseClick.bind(this));
        // Impedir o menu de contexto padrão para usar botão direito como ordem
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }
 
    private handleMouseClick(e: MouseEvent): void {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
 
        if (e.button === 0) { // BOTÃO ESQUERDO: Selecção
            this.processSelection(mouseX, mouseY);
        } else if (e.button === 2) { // BOTÃO DIREITO: Ordem de Marcha
            this.processMoveOrder(mouseX, mouseY);
        }
    }
 
    private processSelection(x: number, y: number): void {
        const entities = entityManager.getEntitiesWith(['Position', 'Sprite']);
        let found = false;
 
        // 1. Limpar selecções anteriores
        const selected = entityManager.getEntitiesWith(['Selection']);
        selected.forEach(id => entityManager.removeComponent(id, 'Selection'));
 
        // 2. Tentar seleccionar nova unidade
        for (const id of entities) {
            const pos = entityManager.getComponent<any>(id, 'Position');
            const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
 
            if (dist < 40) { // Raio de clique tático
                entityManager.addComponent(id, new SelectionComponent());
                eventBus.emit({
                    type: 'UNIT_SELECTED',
                    timestamp: Date.now(),
                    data: { entityId: id }
                });
                found = true;
                break;
            }
        }
 
        if (!found) {
            eventBus.emit({ type: 'SELECTION_CLEARED', timestamp: Date.now(), data: {} });
        }
    }
 
    private processMoveOrder(x: number, y: number): void {
        const selected = entityManager.getEntitiesWith(['Selection', 'Position']);
        
        selected.forEach(id => {
            // Adicionar ou Atualizar Alvo
            entityManager.addComponent(id, new TargetComponent(x, y));
            
            eventBus.emit({
                type: 'MOVE_ORDER_ISSUED',
                timestamp: Date.now(),
                data: { entityId: id, targetX: x, targetY: y }
            });
        });
    }
 
    public update(deltaTime: number): void {
        // Lógica de pulso se necessário
    }
 
    public destroy(): void {
        window.removeEventListener('mousedown', this.handleMouseClick);
        console.log('[SYSTEM] OrderSystem - Downlink Offline.');
    }
}
 
export const orderSystem = new OrderSystem();
