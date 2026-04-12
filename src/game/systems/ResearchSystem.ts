/**
 * src/game/systems/ResearchSystem.ts
 * Motor de Aplicação de Bónus Tecnológicos e I&D.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { gameStateService } from '../../services/GameStateService';

export class ResearchSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] ResearchSystem - Intelligence Lab ONLINE.');
    }

    public update(deltaTime: number): void {
        const globalState = gameStateService.getGlobalState();
        const research = globalState.research || {};
        
        // 1. Aplicar buffs a todas as unidades militares ativas
        const units = entityManager.getEntitiesWith(['Unit']);
        for (const id of units) {
            const unit = entityManager.getComponent<any>(id, 'Unit');
            if (unit) {
                // Buff de ATAQUE (Conforme config: +5% por nível de Pontaria)
                const attackLevel = research['pontaria'] || 0;
                unit.attackBonus = 1 + (attackLevel * 0.05);
                
                // Buff de VELOCIDADE (Conforme config: +10% por nível de Logística)
                const speedLevel = research['logistica'] || 0;
                unit.speedBonus = 1 + (speedLevel * 0.10);
            }
        }

        // 2. Nota: Outros bónus (Capacidade, Produção) são processados no backend,
        // mas o ECS mantém a paridade visual e cinética.
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}
    public destroy(): void {}
}
