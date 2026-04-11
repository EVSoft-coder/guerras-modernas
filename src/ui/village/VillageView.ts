import { entityManager, EntityId } from '../../core/EntityManager';
import { BuildingComponent } from '../../game/components/BuildingComponent';
import { eventBus, Events } from '../../core/EventBus';

/**
 * src/ui/village/VillageView.ts
 * Visualização espacial interativa com suporte para ordens de upgrade.
 */
export class VillageView {
    private container: HTMLElement | null = null;
    private readonly CELL_SIZE = 120;
    private selectedBuildingId: EntityId | null = null;

    public initialize(): void {
        this.createDOM();
        this.setupInteractions();
        this.startUpdateLoop();
        console.log('[UI_VILLAGE] Command & Upgrade Interface ONLINE.');
    }

    private createDOM(): void {
        this.container = document.createElement('div');
        this.container.id = 'village-view-container';
        this.container.style.cssText = `
            position: absolute;
            top: 150px;
            left: 20px;
            z-index: 1000;
            display: none; /* Escondido por defeito */
            gap: 20px;
            font-family: 'Courier New', Courier, monospace;
        `;
        document.body.appendChild(this.container);
    }

    public show(): void {
        if (this.container) this.container.style.display = 'flex';
    }

    public hide(): void {
        if (this.container) this.container.style.display = 'none';
    }

    private setupInteractions(): void {
        if (!this.container) return;

        this.container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            // Ordem de Upgrade
            const upgradeBtn = target.closest('[data-action="upgrade"]');
            if (upgradeBtn && this.selectedBuildingId) {
                this.requestUpgrade(this.selectedBuildingId);
                return; // Evita selecionar novamente
            }

            // Seleção de Edifício
            const buildingBox = target.closest('[data-entity-id]');
            if (buildingBox) {
                const id = parseInt(buildingBox.getAttribute('data-entity-id') || '0');
                this.selectBuilding(id);
            } else {
                const isGrid = target.id === 'grid-canvas';
                if (isGrid) this.selectedBuildingId = null;
            }
        });
    }

    private selectBuilding(id: EntityId): void {
        this.selectedBuildingId = id;
        eventBus.emit({
            type: Events.BUILDING_SELECTED,
            entityId: id,
            timestamp: Date.now(),
            data: { id }
        });
    }

    private requestUpgrade(id: EntityId): void {
        eventBus.emit({
            type: Events.BUILDING_UPGRADE_REQUEST,
            entityId: id,
            timestamp: Date.now(),
            data: { id }
        });
    }

    private startUpdateLoop(): void {
        setInterval(() => this.update(), 500);
    }

    private update(): void {
        if (!this.container) return;

        const buildingEntities = entityManager.getEntitiesWith(['Building']);
        
        let gridHtml = `
            <div style="
                background: rgba(0, 0, 0, 0.9);
                padding: 20px;
                border: 1px solid #00ff00;
                border-left: 5px solid #00ff00;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.15);
            ">
                <div style="font-weight: bold; border-bottom: 1px solid #00ff00; margin-bottom: 15px; font-size: 12px; letter-spacing: 2px; color: #00ff00;">
                    > TACTICAL_VILLAGE_GRID_V1
                </div>
                <div id="grid-canvas" style="position: relative; width: 450px; height: 350px; background-image: radial-gradient(#111 1px, transparent 1px); background-size: 20px 20px;">
        `;

        buildingEntities.forEach(id => {
            const b = entityManager.getComponent<BuildingComponent>(id, 'Building');
            if (b) {
                const x = b.position.x * this.CELL_SIZE;
                const y = b.position.y * this.CELL_SIZE;
                const isSelected = this.selectedBuildingId === id;
                
                gridHtml += `
                    <div data-entity-id="${id}" style="
                        position: absolute;
                        left: ${x}px;
                        top: ${y}px;
                        width: 100px;
                        height: 100px;
                        background: ${isSelected ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 255, 0, 0.05)'};
                        border: 2px solid ${isSelected ? '#fff' : '#00ff00'};
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 10px;
                        box-sizing: border-box;
                        cursor: pointer;
                        ${isSelected ? 'box-shadow: 0 0 15px #fff;' : ''}
                    ">
                        <div style="font-size: 9px; opacity: 0.7; color: #00ff00;">[[${b.buildingType}]]</div>
                        <div style="font-size: 11px; margin: 8px 0; font-weight: bold; color: #00ff00;">${b.name.toUpperCase()}</div>
                        <div style="color: #000; background: #00ff00; padding: 1px 6px; font-size: 10px; font-weight: bold;">LV ${b.level}</div>
                    </div>
                `;
            }
        });

        gridHtml += `</div></div>`;

        let panelHtml = '';
        if (this.selectedBuildingId) {
            const b = entityManager.getComponent<BuildingComponent>(this.selectedBuildingId, 'Building');
            if (b) {
                panelHtml = `
                    <div style="
                        width: 250px;
                        background: rgba(0, 0, 0, 0.95);
                        border: 1px solid #00ff00;
                        padding: 20px;
                        color: #00ff00;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    ">
                        <div style="font-weight: bold; border-bottom: 2px solid #00ff00; padding-bottom: 5px;">COMMAND: BUILDING_OPS</div>
                        
                        <div>
                            <div style="font-size: 10px; color: #666;">OPERATION_TYPE</div>
                            <div style="font-size: 18px; color: #fff;">${b.name}</div>
                        </div>

                        <div>
                            <div style="font-size: 10px; color: #666;">RANK_STATUS</div>
                            <div style="font-size: 14px;">LEVEL ${b.level}</div>
                        </div>

                        <div style="margin-top: 20px;">
                            <button data-action="upgrade" style="
                                width: 100%;
                                padding: 12px;
                                background: #00ff00;
                                color: #000;
                                border: none;
                                font-family: monospace;
                                font-weight: bold;
                                cursor: pointer;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#00ff00'">
                                INITIATE_UPGRADE_REV
                            </button>
                        </div>
                        
                        <div style="font-size: 9px; color: #333; margin-top: auto;">SYNC_ID: ${this.selectedBuildingId}</div>
                    </div>
                `;
            }
        }

        this.container.innerHTML = gridHtml + panelHtml;
    }
}

export const villageView = new VillageView();
