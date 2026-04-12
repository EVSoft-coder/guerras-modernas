/**
 * src/game/systems/AISystem.ts
 * DecisÃ£o AutÃ³noma (DomÃ­nio de IntenÃ§Ã£o).
 */
import { entityManager } from '../../core/EntityManager';
import { TargetComponent } from '../components/BaseComponents';
import { GameSystem } from './types';
 
export class AISystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AISystem - Decision Engine ACTIVE.');
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        const aiUnits = entityManager.getEntitiesWith(['AI', 'GridPosition', 'Unit']);
        const allVillages = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        const allUnits = entityManager.getEntitiesWith(['Unit', 'GridPosition']);

        for (const unitId of aiUnits) {
            const aiComp = entityManager.getComponent<any>(unitId, 'AI');
            const pos = entityManager.getComponent<any>(unitId, 'GridPosition');
            const vel = entityManager.getComponent<any>(unitId, 'Velocity');
            const army = entityManager.getComponent<any>(unitId, 'Army');

            if (!pos || !aiComp || (vel && vel.isMoving)) continue;

            // 1. DEFESA AUTOMÁTICA: Interceptar unidades hostis próximas
            const enemyUnit = this.findNearestTarget(unitId, pos, allUnits, (id) => {
                const otherArmy = entityManager.getComponent<any>(id, 'Army');
                return otherArmy && otherArmy.ownerId !== army?.ownerId;
            });

            if (enemyUnit && enemyUnit.distance < 12) {
                this.commandMove(unitId, vel, enemyUnit.pos);
                console.log(`[AI] DEFENSE: Unit ${unitId} intercepting hostile at ${enemyUnit.pos.x}:${enemyUnit.pos.y}`);
                continue;
            }

            // 2. ATAQUE ESTRATÉGICO: Vilas inimigas
            if (aiComp.behavior === 'AGGRESSIVE') {
                const enemyVillage = this.findNearestTarget(unitId, pos, allVillages, (id) => {
                    const village = entityManager.getComponent<any>(id, 'Village');
                    return village && village.ownerId !== army?.ownerId;
                });

                if (enemyVillage && enemyVillage.distance < 40) {
                    this.commandMove(unitId, vel, enemyVillage.pos);
                    console.log(`[AI] OFFENSIVE: Unit ${unitId} launching raid on village at ${enemyVillage.pos.x}:${enemyVillage.pos.y}`);
                }
            }
        }
    }

    private findNearestTarget(id: number, pos: any, targets: number[], filter: (targetId: number) => boolean) {
        let nearestDist = Infinity;
        let targetPos: any = null;

        for (const targetId of targets) {
            if (targetId === id || !filter(targetId)) continue;
            const tPos = entityManager.getComponent<any>(targetId, 'GridPosition');
            if (!tPos) continue;

            const dist = Math.sqrt(Math.pow(tPos.x - pos.x, 2) + Math.pow(tPos.y - pos.y, 2));
            if (dist < nearestDist) {
                nearestDist = dist;
                targetPos = tPos;
            }
        }

        return targetPos ? { pos: targetPos, distance: nearestDist } : null;
    }

    private commandMove(id: number, vel: any, target: any): void {
        if (!vel) return;
        
        // Simular um evento de movimento para o MovementSystem processar o pathfinding
        const path = (window as any).Pathfinding?.findPath(
            { x: vel.x, y: vel.y },
            { x: target.x, y: target.y },
            () => true
        );

        if (path) {
            vel.path = path;
            vel.isMoving = true;
        }
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] AISystem - Decision Engine SUSPENDED.');
    }
}
 
export const aiSystem = new AISystem();
