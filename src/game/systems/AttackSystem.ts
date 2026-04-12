/**
 * src/game/systems/AttackSystem.ts
 * GestÃ£o de Ciclo de Guerra: Marcha, Combate e Saque.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { AttackMarchComponent, MarchState } from '../components/AttackMarchComponent';

export class AttackSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AttackSystem - Frontline Deployment Operational.');
        
        // Subscrever Ã  pulsaÃ§Ã£o do tempo para processar marchas
        eventBus.subscribe('GAME:TICK', () => {
            this.processMarches();
        });
    }

    private processMarches(): void {
        const marchIds = entityManager.getEntitiesWith(['AttackMarch']);

        for (const id of marchIds) {
            const march = entityManager.getComponent<AttackMarchComponent>(id, 'AttackMarch');
            if (!march) continue;

            // Reduzir tempo de viagem
            march.remainingTime -= 1;

            if (march.remainingTime <= 0) {
                this.handleMarchArrival(id, march);
            }
        }
    }

    private handleMarchArrival(id: number, march: AttackMarchComponent): void {
        if (march.state === 'GOING') {
            console.log(`[WAR] Attack arrived at [${march.targetX}:${march.targetY}]`);
            this.resolveCombat(id, march);
        } else if (march.state === 'RETURNING') {
            console.log(`[WAR] Attack returned to origin ${march.originId}`);
            this.concludeMarch(id, march);
        }
    }

    private resolveCombat(id: number, march: AttackMarchComponent): void {
        // Localizar alvo por coordenadas
        const targets = entityManager.getEntitiesWith(['Position', 'Resource']);
        let targetId: number | null = null;

        for (const tid of targets) {
            const pos = entityManager.getComponent<any>(tid, 'Position');
            if (Math.round(pos.x) === march.targetX && Math.round(pos.y) === march.targetY) {
                targetId = tid;
                break;
            }
        }

        if (targetId !== null) {
            const targetRes = entityManager.getComponent<any>(targetId, 'Resource');
            
            // VitÃ³ria AutomÃ¡tica (Fase 4 - ResoluÃ§Ã£o Simples)
            // Saque de 50% dos recursos
            march.loot.wood = Math.floor(targetRes.wood * 0.5);
            march.loot.stone = Math.floor(targetRes.stone * 0.5);
            march.loot.iron = Math.floor(targetRes.iron * 0.5);

            // Subtrair do alvo
            targetRes.wood -= march.loot.wood;
            targetRes.stone -= march.loot.stone;
            targetRes.iron -= march.loot.iron;

            eventBus.emit({
                type: Events.ATTACK_ARRIVED,
                entityId: id,
                timestamp: Date.now(),
                data: { result: 'VICTORY', loot: march.loot, targetId }
            });
        } else {
            // Nenhum alvo encontrado nas coordenadas (Deserto)
            eventBus.emit({
                type: Events.ATTACK_ARRIVED,
                entityId: id,
                timestamp: Date.now(),
                data: { result: 'EMPTY_TARGET', loot: march.loot }
            });
        }

        // Iniciar Retorno
        march.state = 'RETURNING';
        march.remainingTime = march.totalTime; // Mesma duraÃ§Ã£o para voltar
    }

    private concludeMarch(id: number, march: AttackMarchComponent): void {
        // Repatriar Recursos
        const originRes = entityManager.getComponent<any>(march.originId, 'Resource');
        if (originRes) {
            originRes.wood += march.loot.wood;
            originRes.stone += march.loot.stone;
            originRes.iron += march.loot.iron;
        }

        eventBus.emit({
            type: Events.ATTACK_RETURNED,
            entityId: id,
            timestamp: Date.now(),
            data: { originId: march.originId, finalLoot: march.loot }
        });

        // AutodestruiÃ§Ã£o da entidade de marcha (missÃ£o cumprida)
        entityManager.removeEntity(id);
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] AttackSystem - Frontline Deployment Offline.');
    }
}

export const attackSystem = new AttackSystem();
