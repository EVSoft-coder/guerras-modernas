/**
 * src/game/systems/VisionSystem.ts
 * Motor de InteligÃªncia e Reconhecimento (Neblina de Guerra).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { VisionComponent } from '../components/VisionComponent';

export class VisionSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] VisionSystem - SIGINT Online.');
    }

    public update(deltaTime: number): void {
        const visionEntities = entityManager.getEntitiesWith(['Vision', 'GridPosition', 'Player']);
        const allEntities = entityManager.getEntitiesWith(['GridPosition']);

        // Resetar visibilidade (Simplificado: tudo fica oculto por padrÃ£o em cada frame)
        // Nota: No futuro, podemos guardar um estado de "Explorado"
        for (const id of allEntities) {
            const pos = entityManager.getComponent<any>(id, 'GridPosition');
            if (pos) {
                pos.isVisible = false; 
            }
        }

        // Calcular o que o jogador vÃª
        for (const viewerId of visionEntities) {
            const viewerPos = entityManager.getComponent<any>(viewerId, 'GridPosition');
            const vision = entityManager.getComponent<VisionComponent>(viewerId, 'Vision');

            if (viewerPos && vision) {
                for (const targetId of allEntities) {
                    const targetPos = entityManager.getComponent<any>(targetId, 'GridPosition');
                    if (!targetPos) continue;

                    const dx = targetPos.x - viewerPos.x;
                    const dy = targetPos.y - viewerPos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= vision.range) {
                        targetPos.isVisible = true;
                    }
                }
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] VisionSystem - SIGINT Offline.');
    }
}

export const visionSystem = new VisionSystem();
