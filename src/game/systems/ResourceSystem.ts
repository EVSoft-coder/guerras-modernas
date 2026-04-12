/**
 * src/game/systems/ResourceSystem.ts
 * Motor de Logística e Termodinâmica Económica (Produção vs Consumo).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { VillageComponent } from '../components/VillageComponent';
import { ArmyComponent } from '../components/ArmyComponent';

export class ResourceSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] ResourceSystem - Logistics and Upkeep Engine ACTIVE.');
    }

    public update(deltaTime: number): void {
        this.processLogistics(deltaTime);
    }

    private processLogistics(deltaTime: number): void {
        const entities = entityManager.getEntitiesWith(['Village', 'Resource']);

        for (const id of entities) {
            const res = entityManager.getComponent<any>(id, 'Resource');
            const prod = entityManager.getComponent<any>(id, 'Production');
            const army = entityManager.getComponent<ArmyComponent>(id, 'Army');
            const village = entityManager.getComponent<VillageComponent>(id, 'Village');

            if (!res) continue;

            // A. PRODUÇÃO PASSIVA (ENTRADAS)
            if (prod) {
                const amount = prod.ratePerSecond * deltaTime;
                if (prod.resourceType === 'all') {
                    this.addResource(res, 'suprimentos', amount);
                    this.addResource(res, 'combustivel', amount);
                    this.addResource(res, 'municoes', amount);
                    this.addResource(res, 'metal', amount);
                    this.addResource(res, 'energia', amount);
                    this.addResource(res, 'pessoal', amount);
                } else {
                    this.addResource(res, prod.resourceType, amount);
                }
            }

            // B. CONSUMO DE MANUTENÇÃO (UPKEEP / SAÍDAS)
            let totalUpkeepFood = 0;
            let totalUpkeepFuel = 0;
            let totalEnergyDemand = 0;

            // 1. Manutenção de Tropas (Unidades consomem comida e combustível)
            if (army) {
                const units = army.units;
                totalUpkeepFood += (units['infantaria'] || 0) * 0.01;      // 100 soldados = 1 unid/s
                totalUpkeepFuel += (units['blindado_apc'] || 0) * 0.05;    // Veículos consomem mais
                totalUpkeepFuel += (units['tanque_combate'] || 0) * 0.1;
                totalUpkeepFuel += (units['helicoptero_ataque'] || 0) * 0.2;
            }

            // 2. Demanda Energética de Edifícios
            if (village) {
                // Edifícios avançados consomem energia passivamente
                totalEnergyDemand += village.level * 0.5; // Custo base por nível de setor
            }

            // Aplicar Consumo (deltaTime)
            this.consumeResource(res, 'suprimentos', totalUpkeepFood * deltaTime);
            this.consumeResource(res, 'combustivel', totalUpkeepFuel * deltaTime);
            this.consumeResource(res, 'energia', totalEnergyDemand * deltaTime);
        }
    }

    private addResource(res: any, type: string, amount: number): void {
        if (res[type] !== undefined) {
            res[type] = Math.min(res.cap, res[type] + amount);
        }
    }

    private consumeResource(res: any, type: string, amount: number): void {
        if (res[type] !== undefined) {
            res[type] = Math.max(0, res[type] - amount);
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}
    public destroy(): void {}
}

export const resourceSystem = new ResourceSystem();
