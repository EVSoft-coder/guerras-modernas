import { entityManager } from '../../core/EntityManager';
import { BuildingComponent } from '../../game/components/BuildingComponent';

/**
 * src/ui/village/VillageView.ts
 * Visualização espacial da vila usando o sistema de grelha ECS.
 */
export class VillageView {
    private container: HTMLElement | null = null;
    private readonly CELL_SIZE = 120; // Tamanho de cada célula na grelha (pixels)

    public initialize(): void {
        this.createDOM();
        this.startUpdateLoop();
        console.log('[UI_VILLAGE] Spatial Grid Monitor ONLINE.');
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
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border: 1px solid #00ff00;
            border-left: 5px solid #00ff00;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.15);
        `;
        document.body.appendChild(this.container);
    }

    private startUpdateLoop(): void {
        setInterval(() => this.update(), 500);
    }

    private update(): void {
        if (!this.container) return;

        const buildingEntities = entityManager.getEntitiesWith(['Building']);
        
        let html = `
            <div style="font-weight: bold; border-bottom: 1px solid #00ff00; margin-bottom: 15px; font-size: 12px; letter-spacing: 2px;">
                > TACTICAL_VILLAGE_GRID_V1
            </div>
            <div style="position: relative; width: 400px; height: 300px; background-image: radial-gradient(#111 1px, transparent 1px); background-size: 20px 20px;">
        `;

        if (buildingEntities.length === 0) {
            html += '<div style="color: #444; text-align: center; margin-top: 50px;">NO_DATA_LINK_ESTABLISHED</div>';
        } else {
            buildingEntities.forEach(id => {
                const b = entityManager.getComponent<BuildingComponent>(id, 'Building');
                if (b) {
                    const x = b.position.x * this.CELL_SIZE;
                    const y = b.position.y * this.CELL_SIZE;
                    
                    html += `
                        <div style="
                            position: absolute;
                            left: ${x}px;
                            top: ${y}px;
                            width: 100px;
                            height: 100px;
                            background: rgba(0, 255, 0, 0.05);
                            border: 2px solid #00ff00;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            padding: 10px;
                            box-sizing: border-box;
                            transition: all 0.3s ease;
                        ">
                            <div style="font-size: 9px; opacity: 0.7;">[[${b.buildingType}]]</div>
                            <div style="font-size: 11px; margin: 8px 0; font-weight: bold;">${b.name.toUpperCase()}</div>
                            <div style="color: #000; background: #00ff00; padding: 1px 6px; font-size: 10px; font-weight: bold;">LV ${b.level}</div>
                            <div style="font-size: 8px; margin-top: 5px; color: #555;">LOC: ${b.position.x},${b.position.y}</div>
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
