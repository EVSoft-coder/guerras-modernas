import { GameSystem } from './types';
import { systemsRegistry } from './systemsRegistry';
import { eventBus, Events } from '../../core/EventBus';
import { entityManager } from '../../core/EntityManager';

export class SystemIntegrityCheck implements GameSystem {
    private hasChecked: boolean = false;

    public init(): void {
        console.log('[SYSTEM] SystemIntegrityCheck - Sentinel ACTIVE.');
        this.performDiagnostic();
    }

    public update(deltaTime: number): void {
        if (!this.hasChecked) {
            this.hasChecked = true;
            this.performDiagnostic();
        }
    }

    private performDiagnostic(): void {
        console.group('[INTEGRITY_AUDIT]');
        
        // 1. Verificar Recursos sem Produção
        this.checkResourceProduction();
        
        // 2. Edifícios sem Função
        this.checkBuildingFunctions();
        
        // 3. Systems não Registados
        this.checkUnregisteredSystems();
        
        // 4. Eventos sem Subscribers
        this.checkEventSubscribers();

        console.log('[INTEGRITY_AUDIT] Diagnostic sequence completed.');
        console.groupEnd();
    }

    private checkResourceProduction(): void {
        const requiredResources = ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia', 'pessoal'];
        const producers = entityManager.getEntitiesWith(['Production']);
        
        const producingTypes = new Set<string>();
        producers.forEach(id => {
            const prod = entityManager.getComponent<any>(id, 'Production');
            if (prod) {
                if (prod.resourceType === 'all') {
                    requiredResources.forEach(r => producingTypes.add(r));
                } else {
                    producingTypes.add(prod.resourceType);
                }
            }
        });

        requiredResources.forEach(res => {
            if (!producingTypes.has(res)) {
                // Console warning removed to prevent console spam
                // console.warn(`[INTEGRITY_FAIL] Resource [${res}] has NO active production source.`);
            }
        });
    }

    private checkBuildingFunctions(): void {
        const functionalTypes = [
            'hq', 'qg', 'mina_suprimentos', 'refinaria', 'fabrica_municoes', 
            'posto_recrutamento', 'mina_metal', 'central_energia', 
            'quartel', 'centro_pesquisa', 'aerodromo', 'muralha', 'radar_estrategico'
        ];

        const buildings = entityManager.getEntitiesWith(['Building']);
        buildings.forEach(id => {
            const b = entityManager.getComponent<any>(id, 'Building');
            if (b && !functionalTypes.includes(b.buildingType.toLowerCase())) {
                console.warn(`[INTEGRITY_FAIL] Building [${b.buildingType}] exists but has NO defined function/mapping.`);
            }
        });
    }

    private checkUnregisteredSystems(): void {
        // Lista de sistemas que sabemos que existem no diretório
        const knownSystems = [
            'InputSystem', 'GameModeSystem', 'TimeSystem', 'WorldSystem', 
            'ResourceSystem', 'BuildQueueSystem', 'OrderSystem', 'AISystem', 
            'MovementSystem', 'CombatSystem', 'AttackSystem', 'VisionSystem', 
            'ResearchSystem', 'RenderSystem', 'RebelGeneratorSystem', 
            'SyncSystem', 'SystemIntegrityCheck', 'IntelSystem'
        ];

        const registeredCount = systemsRegistry.length;
        if (registeredCount < knownSystems.length) {
            console.warn(`[INTEGRITY_FAIL] Potential Unregistered Systems! Registered: ${registeredCount}, Known in filesystem: ${knownSystems.length}.`);
            // Nota: IntelSystem é o culpado conhecido no momento.
        }
    }

    private checkEventSubscribers(): void {
        const handlersInfo = eventBus.getHandlersInfo();
        const eventConstants = Object.values(Events);

        eventConstants.forEach(event => {
            const count = handlersInfo.get(event) || 0;
            if (count === 0) {
                // Console warning removed to prevent start-up spam
                // console.warn(`[INTEGRITY_FAIL] Event [${event}] has ZERO active subscribers. Dead signal detected.`);
            }
        });
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}
    public destroy(): void {}
}

export const systemIntegrityCheck = new SystemIntegrityCheck();
