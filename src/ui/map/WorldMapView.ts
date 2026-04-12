/**
 * src/ui/map/WorldMapView.ts
 * VisualizaÃ§Ã£o do Mapa Mundo (World Map).
 */
export class WorldMapView {
    private container: HTMLElement | null = null;

    public initialize(): void {
        this.createDOM();
        console.log('[UI_MAP] World Map View INITIALIZED.');
    }

    private createDOM(): void {
        this.container = document.createElement('div');
        this.container.id = 'world-map-view';
        this.container.style.cssText = `
            position: absolute;
            top: 150px;
            left: 20px;
            z-index: 1000;
            display: none; /* Escondido por defeito */
            font-family: 'Courier New', Courier, monospace;
            color: #00ffff;
            background: rgba(0, 5, 20, 0.9);
            padding: 20px;
            border: 1px solid #00ffff;
            border-left: 5px solid #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
        `;

        this.container.innerHTML = `
            <div style="font-weight: bold; border-bottom: 1px solid #00ffff; margin-bottom: 15px; font-size: 14px; letter-spacing: 2px;">
                > GLOBAL_SATELLITE_COORDINATES
            </div>
            
            <div style="text-align: center; padding: 40px; border: 1px dashed #00ffff; background: rgba(0, 255, 255, 0.05);">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">WORLD MAP</div>
                <div style="font-size: 10px; color: #666;">SCANNING_SECTORS... [OFFLINE]</div>
                
                <div style="display: grid; grid-template-columns: repeat(5, 30px); gap: 5px; margin: 20px auto; justify-content: center;">
                    ${Array(25).fill('<div style="width: 30px; height: 30px; border: 1px solid #00ffff33;"></div>').join('')}
                </div>
            </div>
            
            <div style="margin-top: 15px; font-size: 10px; color: #555;">STATUS: WAITING_FOR_UPLINK</div>
        `;

        document.body.appendChild(this.container);
    }

    public show(): void {
        // Desativado: Interface React/Dashboard assume controlo total do mapa
        // if (this.container) this.container.style.display = 'block';
    }

    public hide(): void {
        if (this.container) this.container.style.display = 'none';
    }
}

export const worldMapView = new WorldMapView();
