import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Base } from '@/types';

interface WorldMapEngineProps {
    center: { x: number, y: number };
    zoom: number;
    bases: any[];
    playerBase?: Base;
    onSectorClick: (x: number, y: number, base?: any) => void;
    myAllianceId?: number | null;
    diplomaties?: any[];
}

const TILE_SIZE = 80;

export const WorldMapEngine: React.FC<WorldMapEngineProps> = ({ 
    center, 
    zoom, 
    bases, 
    playerBase, 
    onSectorClick,
    myAllianceId,
    diplomaties = []
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset relativo ao centro real

    // Carregar texturas
    const textures = useRef<Record<string, HTMLImageElement>>({});

    useEffect(() => {
        const terrainTypes = ['grass', 'mountain', 'desert', 'water', 'base'];
        terrainTypes.forEach(type => {
            const img = new Image();
            img.src = type === 'base' ? '/assets/structures/base.png' : `/assets/terrains/${type}.png`;
            img.onload = () => { textures.current[type] = img; };
        });
    }, []);

    const getTerrain = (tx: number, ty: number) => {
        if (ty < 0 || ty > 1000 || tx < 0 || tx > 1000) return 'water';
        const noise = (Math.sin(tx * 0.12) + Math.cos(ty * 0.15) + Math.sin(tx * 0.3 + ty * 0.2)) / 3;
        if (noise > 0.53) return 'mountain';
        if (noise < -0.45) return 'desert';
        if (noise < -0.65) return 'water';
        return 'grass';
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        
        // Aplicar Zoom e Pan
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-center.x * TILE_SIZE + offset.x, -center.y * TILE_SIZE + offset.y);

        // Calcular range visível
        const visibleRangeX = Math.ceil((width / zoom) / TILE_SIZE / 2) + 1;
        const visibleRangeY = Math.ceil((height / zoom) / TILE_SIZE / 2) + 1;

        const startX = Math.floor(center.x - visibleRangeX);
        const endX = Math.ceil(center.x + visibleRangeX);
        const startY = Math.floor(center.y - visibleRangeY);
        const endY = Math.ceil(center.y + visibleRangeY);

        // 1. Renderizar Terreno
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const terrain = getTerrain(x, y);
                const img = textures.current[terrain];
                if (img) {
                    ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else {
                    // Fallback se imagem ainda não carregou
                    ctx.fillStyle = terrain === 'water' ? '#1e3a8a' : (terrain === 'mountain' ? '#374151' : '#064e3b');
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }

                // Grid sutil
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }

        // 2. Renderizar Linhas de Marcha (Troop Movements)
        bases.forEach(base => {
            // Se a base tem tropas em movimento (simulação via entities do globalState)
            // Por agora, vamos usar as entidades que vêm do GameState
        });

        // NOTA: Para um visual 3.0 real, vamos desenhar vetores de ataque
        // Se houver ataques ativos no sistema, desenhamos linhas pulsantes
        
        // 3. Renderizar Bases
        bases.forEach(base => {
            if (base.coordenada_x >= startX && base.coordenada_x <= endX && 
                base.coordenada_y >= startY && base.coordenada_y <= endY) {
                
                const img = textures.current['base'];
                const bx = base.coordenada_x * TILE_SIZE;
                const by = base.coordenada_y * TILE_SIZE;

                if (img) {
                    const isPlayer = base.ownerId === playerBase?.ownerId;
                    const baseAllianceId = base.aliancaId;
                    const dip = diplomaties.find(d => d.target_alianca_id === baseAllianceId && d.status === 'ACCEPTED');
                    const isAlly = baseAllianceId && (baseAllianceId === myAllianceId || dip?.tipo === 'ALLY');
                    const isEnemy = dip?.tipo === 'ENEMY' || (base.ownerId && !isAlly && !isPlayer);

                    // Glow Effect
                    ctx.save();
                    ctx.shadowBlur = 20 / zoom;
                    ctx.shadowColor = isPlayer ? '#0ea5e9' : (isAlly ? '#06b6d4' : (isEnemy ? '#ef4444' : '#f59e0b'));
                    
                    // Desenhar Base
                    ctx.drawImage(img, bx + 10, by + 10, TILE_SIZE - 20, TILE_SIZE - 20);
                    ctx.restore();

                    // Etiqueta de Identificação (se zoom alto)
                    if (zoom > 0.6) {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                        ctx.fillRect(bx + 5, by + TILE_SIZE - 18, TILE_SIZE - 10, 14);
                        
                        ctx.fillStyle = isPlayer ? '#7dd3fc' : (isAlly ? '#67e8f9' : (isEnemy ? '#fca5a5' : '#fcd34d'));
                        ctx.font = '900 8px "Inter", sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(base.nome.toUpperCase(), bx + TILE_SIZE / 2, by + TILE_SIZE - 8);
                        
                        // Border indicator
                        ctx.strokeStyle = ctx.fillStyle;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(bx + 5, by + TILE_SIZE - 18, TILE_SIZE - 10, 14);
                    }
                }
            }
        });

        // 4. Scanlines & Tactical CRT Effect
        ctx.restore();
        
        // Scanlines
        ctx.fillStyle = 'rgba(18, 16, 16, 0.1)';
        for (let i = 0; i < height; i += 4) {
            ctx.fillRect(0, i, width, 1);
        }

        // Vignette
        const grd = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.2);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);

    }, [center, zoom, offset, bases, playerBase, myAllianceId, diplomaties]);

    useEffect(() => {
        const frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, [draw]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = (e.clientX - lastMousePos.x) / zoom;
        const dy = (e.clientY - lastMousePos.y) / zoom;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <canvas 
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => {
                // Cálculo de coordenada clicada
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const mouseX = (e.clientX - rect.left - rect.width / 2) / zoom;
                const mouseY = (e.clientY - rect.top - rect.height / 2) / zoom;
                
                const tx = Math.floor((mouseX - offset.x) / TILE_SIZE + center.x);
                const ty = Math.floor((mouseY - offset.y) / TILE_SIZE + center.y);
                
                const baseAt = bases.find(b => b.coordenada_x === tx && b.coordenada_y === ty);
                onSectorClick(tx, ty, baseAt);
            }}
        />
    );
};
