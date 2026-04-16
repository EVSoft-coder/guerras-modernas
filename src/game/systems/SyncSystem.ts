/**
 * src/game/systems/SyncSystem.ts
 * Orquestrador de SincronizaÃ§Ã£o: Laravel -> ECS e ECS -> UI.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { AttackMarchComponent } from '../components/AttackMarchComponent';
import { gameStateService } from '../../services/GameStateService';
import { Logger } from '../../core/Logger';

export class SyncSystem implements GameSystem {
    public init(): void {
        Logger.info('[SYSTEM] SyncSystem - Uplink Established.');
        
        // Subscrever a eventos de sincronização externa
        eventBus.subscribe(Events.LARAVEL_SYNC_ATTACKS, (p) => {
            this.syncLaravelAttacks(p.data.attacks);
        });

        // Capturar resultados de combate para persistência de relatórios
        eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
            if (ev.data.report) {
                this.persistReport(ev.data.report);
            }
        });

        // ACTIONS: Player Intent Handlers
        eventBus.subscribe(Events.BUILDING_UPGRADE_REQUEST, (ev) => this.handleBuildingUpgrade(ev.data));
        eventBus.subscribe(Events.UNIT_TRAIN_REQUEST, (ev) => this.handleUnitTraining(ev.data));
        eventBus.subscribe(Events.ATTACK_LAUNCH, (ev) => this.handleAttackLaunch(ev.data));
    }

    private async handleBuildingUpgrade(data: any): Promise<void> {
        try {
            Logger.building('UPGRADE_REQUEST', data);
            const response = await fetch('/buildings/upgrade', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || ''
                },
                body: JSON.stringify({ base_id: data.base_id, tipo: data.tipo })
            });

            const resData = await response.json();
            Logger.backend('UPGRADE_RESPONSE', { status: response.status, data: resData });

            if (!response.ok) {
                throw new Error(resData.message || 'Operation Denied');
            }
            
            // Garantir que a UI reflete a nova fila de construção
            const { router } = await import('@inertiajs/react');
            router.reload();
            eventBus.emit(Events.ACTION_SUCCESS, { data: { type: 'UPGRADE' } });

            Logger.info('[ACTION] Structural upgrade authorized by Central Command.');
        } catch (err: any) {
            Logger.error('[ACTION_FAILURE] Building upgrade aborted', err);
            eventBus.emit(Events.UI_ALERT, { data: { message: err.message, type: 'error' } });
        }
    }

    private async handleUnitTraining(data: any): Promise<void> {
        try {
            Logger.building('TRAINING_REQUEST', data);
            const response = await fetch('/base/treinar', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || ''
                },
                body: JSON.stringify({ base_id: data.base_id, unidade: data.unidade, quantidade: data.quantidade })
            });

            const resData = await response.json();
            Logger.backend('TRAINING_RESPONSE', { status: response.status, data: resData });

            if (!response.ok) {
                throw new Error(resData.message || 'Recruitment Failed');
            }
            
            // Re-hidratar ECS com dados puros do backend (Source of Truth)
            const { router } = await import('@inertiajs/react');
            router.reload();
            eventBus.emit(Events.ACTION_SUCCESS, { data: { type: 'RECRUITMENT' } });

            Logger.info('[ACTION] Recruitment procedures online.');
        } catch (err: any) {
            Logger.error('[ACTION_FAILURE] Recruitment aborted', err);
            eventBus.emit(Events.UI_ALERT, { data: { message: err.message, type: 'error' } });
        }
    }

    private async handleAttackLaunch(data: any): Promise<void> {
        try {
            Logger.info('[ACTION] Launching Military Expedition...');
            
            const response = await fetch('/base/atacar', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || ''
                },
                body: JSON.stringify(data.backendParams)
            });

            const resData = await response.json();
            Logger.backend('ATTACK_RESPONSE', { status: response.status, data: resData });

            if (!response.ok) throw new Error('Expedition Aborted by Tactical HQ');
            Logger.info('[ACTION] Expedition is en-route.');
        } catch (err) {
            Logger.error('[ACTION_FAILURE] Military operation failed', err);
        }
    }

    private async persistReport(report: any): Promise<void> {
        try {
            await fetch('/api/relatorios/store', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || ''
                },
                body: JSON.stringify({
                    titulo: `OPERATIONAL REPORT: ${report.resultado}`,
                    detalhes: report,
                    vencedor_id: report.vencedor === 'ATACANTE' ? 1 : 2 // Mock IDs por agora
                })
            });
            Logger.info('[SYNC] Battle report uploaded to Central Command.');
        } catch (err) {
            Logger.error('[SYNC] Failed to transmit battle report', err);
        }
    }

    private syncLaravelAttacks(attacks: any[]): void {
        attacks.forEach(atk => {
            const eId = 10000 + atk.id; // Namespace para entidades de ataque
            if (!entityManager.getEntitiesWith(['AttackMarch']).includes(eId)) {
                const now = Date.now();
                const arrival = new Date(atk.chegada_em).getTime();
                const total = Math.round((arrival - new Date(atk.created_at).getTime()) / 1000);
                const remaining = Math.round((arrival - now) / 1000);

                if (remaining > 0) {
                    entityManager.createEntity(eId);
                    entityManager.addComponent(eId, new AttackMarchComponent(
                        atk.origem_base_id,
                        atk.destino_x || 0,
                        atk.destino_y || 0,
                        atk.tropas || {},
                        total,
                        remaining,
                        'GOING'
                    ));
                }
            }
        });
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}

    public postUpdate(deltaTime: number): void {
        // Capturar snapshot para a UI no final de cada frame
        gameStateService.snap();
    }

    public destroy(): void {
        Logger.info('[SYSTEM] SyncSystem - Uplink Terminated.');
    }
}

export const syncSystem = new SyncSystem();
