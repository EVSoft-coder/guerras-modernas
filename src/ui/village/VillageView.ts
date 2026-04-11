import { entityManager } from '../../core/EntityManager';
import { BuildingComponent } from '../../game/components/BuildingComponent';

/**
 * src/ui/village/VillageView.ts
 * Visualização tática das infraestruturas da vila.
 */
export class VillageView {
    private container: HTMLElement | null = null;

    public initialize(): void {
        this.createDOM();
        this.startUpdateLoop();
        console.log('[UI_VILLAGE] Village Monitor ONLINE.');
    }

    private createDOM(): void {
        this.container = document.createElement('div');
        this.container.id = 'village-view';
        this.container.style.cssText = `
            position: absolute;
            top: 150px;
            left: 20px;
            z-index: 1000;
            font-family: 'Courier New', Courier, monospace;
            color: #00ff00;
            background: rgba(0, 0, 0, 0.85);
            padding: 15px;
            border: 1px solid #00ff00;
            border-left: 5px solid #00ff00;
            min-width: 220px;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
        `;
        document.body.appendChild(this.container);
    }

    private startUpdateLoop(): void {
        // Atualização em tempo real (2 vezes por segundo é suficiente para edifícios)
        setInterval(() => this.update(), 500);
    }

    private update(): void {
        if (!this.container) return;

        const buildingEntities = entityManager.getEntitiesWith(['Building']);
        
        let html = `
            <div style="font-weight: bold; border-bottom: 1px solid #00ff00; margin-bottom: 10px; font-size: 14px;">
                > VILLAGE_INFRASTRUCTURE
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
        `;

        if (buildingEntities.length === 0) {
            html += '<div style="color: #666; font-style: italic;">NO_STRUCTURES_FOUND</div>';
        } else {
            buildingEntities.forEach(id => {
                const b = entityManager.getComponent<BuildingComponent>(id, 'Building');
                if (b) {
                    html += `
                        <div style="display: flex; justify-content: space-between;">
                            <span>${b.name.toUpperCase()}</span>
                            <span style="color: #fff;">LVL ${b.level}</span>
                        </div>
                    `;
                }
            });
        }

        html += `</div>`;
        this.container.innerHTML = html;
    }
}

export const villageView = new VillageView();
