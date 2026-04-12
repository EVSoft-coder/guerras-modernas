import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { ArmyComponent } from '../components/ArmyComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { VelocityComponent } from '../components/Velocity';
import { Pathfinding } from '../../utils/Pathfinding';
import { RenderableComponent } from '../components/RenderableComponent';
import { UnitComponent } from '../components/UnitComponent';
import { MarchComponent } from '../components/MarchComponent';
import { movementSystem } from './MovementSystem';

export class AttackSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AttackSystem - War Room Operational.');
        
        // Subscrever à ordem de lançamento de expedição
        eventBus.subscribe(Events.ATTACK_LAUNCH, (payload) => {
            this.launchAttack(payload.data);
        });
    }

    public update(deltaTime: number): void {
        const now = Date.now();
        const marches = entityManager.getEntitiesWith(['March']);

        for (const armyId of marches) {
            const march = entityManager.getComponent<any>(armyId, 'March');
            
            if (march && march.status === 'going' && now >= march.arrivalTime) {
                console.log(`[WAR] CONTACT: Army ${armyId} reached objective at ${march.targetX}:${march.targetY}`);
                
                // Disparar resolução de combate
                eventBus.emit('ATTACK:RESOLVE', {
                    entityId: armyId,
                    timestamp: now,
                    data: { march }
                });

                // Mudar estado para evitar múltiplos disparos no mesmo frame
                march.status = 'completed'; // Será processado pelo CombatSystem para 'returning' ou 'destroyed'
            }
        }
    }

    private launchAttack(data: any): void {
        const { originX, originY, targetX, targetY, ownerId, troops } = data;

        // Gerar ID único de missão
        const missionId = `MSN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const armyId = entityManager.createEntity();
        
        // 1. Definir Identidade e Composição
        entityManager.addComponent(armyId, new ArmyComponent(ownerId, troops));
        
        // 2. Definir Posição Geográfica Inicial
        entityManager.addComponent(armyId, new GridPositionComponent(originX, originY, true));

        // 3. Calcular Logística de Marcha (Usando a nova factory logic se possível, ou inline aqui)
        const dx = targetX - originX;
        const dy = targetY - originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Obter velocidade mais lenta
        let slowestSpeed = 10; 
        // Nota: unitStats deve ser importado se quisermos precisão total aqui, 
        // mas para o lançamento ECS usamos a lógica tática definida.

        const travelTimeMs = (distance / slowestSpeed) * (3600 / 5) * 1000;

        entityManager.addComponent(armyId, new MarchComponent(
            missionId,
            originX,
            originY,
            targetX,
            targetY,
            troops,
            Date.now(),
            Date.now() + travelTimeMs,
            Date.now() + (travelTimeMs * 2), // Estimativa de retorno
            'going'
        ));

        // 4. Marcação de Tipo para o Satélite
        entityManager.addComponent(armyId, { type: 'Army' });

        console.log(`[WAR] Army ${armyId} [${missionId}] deployed. ETA: ${(travelTimeMs / 1000).toFixed(1)}s`);
    }
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] AttackSystem - War Room Offline.');
    }
}

export const attackSystem = new AttackSystem();
