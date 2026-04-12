import { entityManager } from '../../core/EntityManager';
import { eventBus } from '../../core/EventBus';
import { GameSystem } from './types';
import { VillageComponent } from '../components/VillageComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { ArmyComponent } from '../components/ArmyComponent';

export class RebelGeneratorSystem implements GameSystem {
    private lastSpawnTime: number = 0;
    private lastProgressionTime: number = 0;
    private lastRegenTime: number = 0;
    private spawnInterval: number = 60000; // 1 minuto entre scans
    private progressionInterval: number = 300000; // 5 minutos entre evoluções
    private regenInterval: number = 10000; // 10 segundos entre regenerações
    private maxRebels: number = 15;
    private mapSize: number = 20;

    public init(): void {
        console.log('[SYSTEM] RebelGeneratorSystem - Evolution Protocols ACTIVE.');
        this.lastSpawnTime = Date.now();
        this.lastProgressionTime = Date.now();
        this.lastRegenTime = Date.now();
    }

    public preUpdate(deltaTime: number): void {}

    public update(deltaTime: number): void {
        const now = Date.now();
        
        // A. Geração de novos rebeldes
        if (now - this.lastSpawnTime >= this.spawnInterval) {
            this.lastSpawnTime = now;
            this.processGeneration();
        }

        // B. Evolução dos rebeldes existentes
        if (now - this.lastProgressionTime >= this.progressionInterval) {
            this.lastProgressionTime = now;
            this.processProgression();
        }

        // C. Regeneração de guarnição (Reposição de baixas)
        if (now - this.lastRegenTime >= this.regenInterval) {
            this.lastRegenTime = now;
            this.processRegeneration();
        }
    }

    public postUpdate(deltaTime: number): void {}

    private processRegeneration(): void {
        const entities = entityManager.getEntitiesWith(['Village']);
        const regenRatePerLevel = 1; // 1 soldado por nível a cada 10 segundos
        
        for (const id of entities) {
            const village = entityManager.getComponent<VillageComponent>(id, 'Village');
            if (village && village.isRebel) {
                const army = entityManager.getComponent<ArmyComponent>(id, 'Army');
                if (army) {
                    const maxInfantry = village.level === 1 ? 20 : (village.level * 120);
                    const currentInfantry = army.units['infantaria'] || 0;
                    
                    if (currentInfantry < maxInfantry) {
                        const amount = Math.min(maxInfantry - currentInfantry, regenRatePerLevel * village.level);
                        army.units['infantaria'] = currentInfantry + amount;
                        
                        if (amount > 0) {
                            console.log(`[REBEL_REGEN] Sector ${id} reinforced (${currentInfantry} -> ${army.units['infantaria']})`);
                        }
                    }
                }
            }
        }
    }

    private processProgression(): void {
        const entities = entityManager.getEntitiesWith(['Village']);
        
        for (const id of entities) {
            const village = entityManager.getComponent<VillageComponent>(id, 'Village');
            if (village && village.isRebel && village.level < 10) {
                village.level++;
                
                // 1. Aumentar Recursos (Logística Interna)
                const bonus = 100;
                (village.resources as any).suprimentos += bonus;
                (village.resources as any).combustivel += bonus;
                (village.resources as any).metal += bonus;
                (village.resources as any).municoes += bonus;

                // 2. Fortificação de Guarnição (Recrutamento Rebelde)
                const army = entityManager.getComponent<ArmyComponent>(id, 'Army');
                if (army) {
                    army.units['infantaria'] = (army.units['infantaria'] || 0) + 120;
                    
                    if (village.level >= 3) {
                        army.units['blindado_apc'] = (army.units['blindado_apc'] || 0) + 20;
                    }
                    
                    if (village.level >= 5) {
                        army.units['tanque_combate'] = (army.units['tanque_combate'] || 0) + 5;
                    }
                }
                
                console.log(`[REBEL_EVOLUTION] Sector ${id} escalated to Level ${village.level}. Resources and garrison UPGRADED.`);
            }
        }
        
        // Sincronizar UI se necessário
        eventBus.emit('MAPA:FORCE_REFRESH', {});
    }

    private processGeneration(): void {
        const villages = entityManager.getEntitiesWith(['Village']);
        const rebelCount = villages.filter(id => {
            const v = entityManager.getComponent<VillageComponent>(id, 'Village');
            return v?.isRebel;
        }).length;

        if (rebelCount < this.maxRebels) {
            console.log(`[REBEL] Under-limit detected (${rebelCount}/${this.maxRebels}). Generating reinforcements...`);
            this.spawnRebel();
        }
    }

    private spawnRebel(): void {
        const coords = this.findFreeCoords();
        if (!coords) return;

        const level = Math.floor(Math.random() * 5) + 1;
        const rebelId = entityManager.createEntity();
        
        entityManager.addComponent(rebelId, new VillageComponent(
            null, 
            level,
            { 
                suprimentos: level * 100, 
                combustivel: level * 100, 
                municoes: level * 100, 
                pessoal: 0, 
                metal: level * 100, 
                energia: 0 
            },
            `Rebel_Outpost_LVL${level}`,
            true
        ));

        const units: Record<string, number> = {};
        units['infantaria'] = level === 1 ? 20 : (level * 120); 
        
        if (level >= 3) {
            units['blindado_apc'] = (level - 2) * 20;
        }
        
        if (level === 5) {
            units['tanque_combate'] = 15;
        }

        if (level >= 4) {
            units['politico'] = 1; // Liderança ideológica rebelde
        }

        entityManager.addComponent(rebelId, new ArmyComponent(0, units));
        entityManager.addComponent(rebelId, new GridPositionComponent(coords.x, coords.y));
        
        console.log(`[REBEL] NEW INSURRECTION: Entity ${rebelId} spawned at ${coords.x}:${coords.y}.`);
    }

    private findFreeCoords(): { x: number, y: number } | null {
        const occupied = new Set<string>();
        const entities = entityManager.getEntitiesWith(['GridPosition']);
        for (const id of entities) {
            const pos = entityManager.getComponent<GridPositionComponent>(id, 'GridPosition');
            if (pos) occupied.add(`${pos.x},${pos.y}`);
        }
        for (let attempts = 0; attempts < 50; attempts++) {
            const rx = Math.floor(Math.random() * this.mapSize);
            const ry = Math.floor(Math.random() * this.mapSize);
            if (!occupied.has(`${rx},${ry}`)) return { x: rx, y: ry };
        }
        return null;
    }

    public destroy(): void {
        console.log('[SYSTEM] RebelGeneratorSystem - Insurrection monitor OFFLINE.');
    }
}
