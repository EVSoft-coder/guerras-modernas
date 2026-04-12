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
        const villages = entityManager.getEntitiesWith(['Village', 'Resource']);
        const buildings = entityManager.getEntitiesWith(['Building', 'Production']);

        // 1. Resetar taxas temporárias ou acumular produção de edifícios
        const villageProduction = new Map<number, Record<string, number>>();

        for (const bId of buildings) {
            const building = entityManager.getComponent<any>(bId, 'Building');
            const prod = entityManager.getComponent<any>(bId, 'Production');
            
            if (building && building.villageId !== undefined && prod) {
                if (!villageProduction.has(building.villageId)) {
                    villageProduction.set(building.villageId, {
                        suprimentos: 0, combustivel: 0, municoes: 0, metal: 0, energia: 0, pessoal: 0
                    });
                }
                
                const rates = villageProduction.get(building.villageId)!;
                const amount = prod.ratePerSecond * deltaTime;
                
                if (prod.resourceType === 'all') {
                    Object.keys(rates).forEach(k => rates[k] += amount);
                } else if (rates[prod.resourceType] !== undefined) {
                    rates[prod.resourceType] += amount;
                }
            }
        }

        // 2. Aplicar Produção e Consumo nas Vilas
        for (const vId of villages) {
            const res = entityManager.getComponent<any>(vId, 'Resource');
            const army = entityManager.getComponent<ArmyComponent>(vId, 'Army');
            const village = entityManager.getComponent<VillageComponent>(vId, 'Village');

            if (!res) continue;

            // A. APLICAR PRODUÇÃO ACUMULADA
            const rates = villageProduction.get(vId);
            if (rates) {
                Object.keys(rates).forEach(type => {
                    this.addResource(res, type, rates[type]);
                });
            }

            // B. PRODUÇÃO NATIVA DA VILA (Legacy/Base)
            const nativeProd = entityManager.getComponent<any>(vId, 'Production');
            if (nativeProd) {
                const amount = nativeProd.ratePerSecond * deltaTime;
                if (nativeProd.resourceType === 'all') {
                    ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia', 'pessoal'].forEach(r => this.addResource(res, r, amount));
                } else {
                    this.addResource(res, nativeProd.resourceType, amount);
                }
            }

            // C. CONSUMO DE MANUTENÇÃO (UPKEEP)
            let totalUpkeepFood = 0;
            let totalUpkeepFuel = 0;
            let totalEnergyDemand = 0;

            if (army) {
                const units = army.units;
                totalUpkeepFood += (units['infantaria'] || 0) * 0.01;
                totalUpkeepFuel += (units['blindado_apc'] || 0) * 0.05;
                totalUpkeepFuel += (units['tanque_combate'] || 0) * 0.1;
                totalUpkeepFuel += (units['helicoptero_ataque'] || 0) * 0.2;
            }

            if (village) {
                totalEnergyDemand += village.level * 0.5;
            }

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
