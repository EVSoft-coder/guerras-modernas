import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Base } from '@/types';
import { getTerrain, TILE_SIZE } from '@/config/mapConfig';

interface WorldMapEngineProps {
    center: { x: number, y: number };
    zoom: number;
    bases: any[];
    gameEntities: any[];
    playerBase?: Base;
    onSectorClick: (x: number, y: number, base?: any) => void;
    myAllianceId?: number | null;
    diplomaties?: any[];
}


export const WorldMapEngine: React.FC<WorldMapEngineProps> = ({ 
    center, 
    zoom, 
    bases, 
    gameEntities = [],
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
        const terrainTypes = ['grass', 'mountain', 'desert', 'water', 
                             'base_lvl1', 'base_lvl2', 'base_lvl3', 'base_lvl4'];
        terrainTypes.forEach(type => {
            const img = new Image();
            img.src = type.startsWith('base') ? `/assets/structures/${type}.png` : `/assets/terrains/${type}.png`;
            img.onload = () => { textures.current[type] = img; };
        });
    }, []);

    const [hoveredSector, setHoveredSector] = useState<{x: number, y: number, base?: any} | null>(null);

    const getBaseTexture = (pontos: number) => {
        if (pontos < 200) return 'base_lvl1';
        if (pontos < 1000) return 'base_lvl2';
        if (pontos < 3000) return 'base_lvl3';
        return 'base_lvl4';
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
                    ctx.fillStyle = terrain === 'water' ? '#0f172a' : (terrain === 'mountain' ? '#1e293b' : '#064e3b');
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }

                // Grelha Tática (TW Style)
                ctx.strokeStyle = 'rgba(255,255,255,0.03)';
                if (x % 5 === 0) ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Coordenadas (Apenas em zooms altos e múltiplos de 5)
                if (zoom > 0.8 && x % 5 === 0 && y % 5 === 0) {
                    ctx.fillStyle = 'rgba(255,255,255,0.2)';
                    ctx.font = '8px monospace';
                    ctx.fillText(`${x},${y}`, x * TILE_SIZE + 2, y * TILE_SIZE + 10);
                }
            }
        }

        // 2. Renderizar Linhas de Marcha (Troop Movements)
        // ... (Movimentos mantidos conforme original mas com cores TW)
        gameEntities.forEach(e => {
            const sx = e.originX * TILE_SIZE + TILE_SIZE / 2;
            const sy = e.originY * TILE_SIZE + TILE_SIZE / 2;
            const tx = e.targetX * TILE_SIZE + TILE_SIZE / 2;
            const ty = e.targetY * TILE_SIZE + TILE_SIZE / 2;
            const cx = e.x * TILE_SIZE + TILE_SIZE / 2;
            const cy = e.y * TILE_SIZE + TILE_SIZE / 2;

            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)'; // Yellowish for movements
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2 / zoom;
            ctx.moveTo(sx, sy);
            ctx.lineTo(cx, cy);
            ctx.stroke();

            ctx.save();
            ctx.translate(cx, cy);
            const angle = Math.atan2(ty - sy, tx - sx);
            ctx.rotate(angle);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(10 / zoom, 0);
            ctx.lineTo(-6 / zoom, -6 / zoom);
            ctx.lineTo(-6 / zoom, 6 / zoom);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
        
        // 3. Renderizar Bases
        bases.forEach(base => {
            if (base.coordenada_x >= startX && base.coordenada_x <= endX && 
                base.coordenada_y >= startY && base.coordenada_y <= endY) {
                
                const texKey = getBaseTexture(base.pontos || 0);
                const img = textures.current[texKey];
                const bx = base.coordenada_x * TILE_SIZE;
                const by = base.coordenada_y * TILE_SIZE;

                const isPlayer = base.jogador_id === playerBase?.jogador_id;
                const isAlly = base.jogador?.alianca_id && (base.jogador.alianca_id === myAllianceId);
                const isEnemy = !base.is_npc && !isPlayer && !isAlly;
                const isRebel = base.is_npc;

                // Color Scheme
                const color = isPlayer ? '#3b82f6' : (isAlly ? '#fbbf24' : (isEnemy ? '#ef4444' : '#71717a'));

                // Base Icon Glow & Pulse for Player
                ctx.save();
                
                if (isPlayer) {
                    const pulse = (Math.sin(Date.now() / 300) + 1) / 2;
                    ctx.shadowBlur = (15 + pulse * 10) / zoom;
                    ctx.shadowColor = color;
                    
                    // Pulse ring
                    ctx.beginPath();
                    ctx.arc(bx + TILE_SIZE/2, by + TILE_SIZE/2, (TILE_SIZE/2 - 5) + pulse * 5, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 - pulse * 0.4})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.shadowBlur = 15 / zoom;
                    ctx.shadowColor = color;
                }
                
                if (img) {
                    ctx.drawImage(img, bx + 5, by + 5, TILE_SIZE - 10, TILE_SIZE - 10);
                } else {
                    ctx.fillStyle = color;
                    ctx.fillRect(bx + 20, by + 20, TILE_SIZE - 40, TILE_SIZE - 40);
                }
                ctx.restore();

                // Identificação Tática (Premium Labels)
                if (zoom > 0.4) {
                    const labelWidth = TILE_SIZE - 4;
                    const labelHeight = 14;
                    const ly = by + TILE_SIZE - 12;
                    
                    // Glassmorphism Label Background
                    ctx.fillStyle = 'rgba(5, 8, 15, 0.85)';
                    ctx.beginPath();
                    ctx.roundRect(bx + 2, ly, labelWidth, labelHeight, 4);
                    ctx.fill();
                    ctx.strokeStyle = color + '44';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    
                    // Name Text
                    ctx.fillStyle = '#ffffff';
                    ctx.font = `bold ${zoom > 0.8 ? '8px' : '7px'} "Inter", sans-serif`;
                    ctx.textAlign = 'center';
                    const label = base.nome.substring(0, 14) + (base.nome.length > 14 ? '..' : '');
                    ctx.fillText(label.toUpperCase(), bx + TILE_SIZE / 2, ly + 10);
                    
                    // Points Tag (Side)
                    if (zoom > 0.8) {
                        ctx.fillStyle = color;
                        ctx.font = 'black 6px "JetBrains Mono", monospace';
                        ctx.textAlign = 'left';
                        ctx.fillText(`${base.pontos || 0}P`, bx + TILE_SIZE + 2, by + 10);
                    }
                }
            }
        });

        // 5. Render Hover Tooltip
        if (hoveredSector && !isDragging) {
            const bx = hoveredSector.x * TILE_SIZE;
            const by = hoveredSector.y * TILE_SIZE;
            
            // Highlight do setor
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2 / zoom;
            ctx.strokeRect(bx, by, TILE_SIZE, TILE_SIZE);
            
            if (hoveredSector.base) {
                const b = hoveredSector.base;
                const isPlayer = b.jogador_id === playerBase?.jogador_id;
                const isAlly = b.jogador?.alianca_id && (b.jogador.alianca_id === myAllianceId);
                const color = isPlayer ? '#3b82f6' : (isAlly ? '#fbbf24' : (b.is_npc ? '#71717a' : '#ef4444'));

                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(bx + TILE_SIZE + 5, by, 120, 50);
                ctx.strokeStyle = color + '66';
                ctx.strokeRect(bx + TILE_SIZE + 5, by, 120, 50);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 9px "Inter", sans-serif';
                ctx.fillText(b.nome.toUpperCase(), bx + TILE_SIZE + 12, by + 15);
                
                ctx.font = '8px "Inter", sans-serif';
                ctx.fillStyle = color;
                ctx.fillText(isPlayer ? 'A TUA BASE' : (isAlly ? 'ALIADO' : (b.is_npc ? 'REBELDE' : 'INIMIGO')), bx + TILE_SIZE + 12, by + 28);
                
                ctx.fillStyle = '#aaa';
                ctx.fillText(`PONTOS: ${b.pontos || 0}`, bx + TILE_SIZE + 12, by + 38);
                ctx.fillText(`COORD: ${b.coordenada_x}|${b.coordenada_y}`, bx + TILE_SIZE + 12, by + 46);
            }
        }

        // 4. Scanlines & Tactical CRT Effect
        ctx.restore();
        
        // Radar Sweep Effect
        const sweepAngle = (Date.now() / 2000) % (Math.PI * 2);
        const sweepGrd = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
        sweepGrd.addColorStop(0, 'rgba(34, 197, 94, 0.05)');
        sweepGrd.addColorStop(1, 'rgba(34, 197, 94, 0)');
        
        ctx.save();
        ctx.translate(width/2, height/2);
        ctx.rotate(sweepAngle);
        ctx.fillStyle = sweepGrd;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, width, -0.2, 0.2);
        ctx.fill();
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

    }, [center, zoom, offset, bases, gameEntities, playerBase, myAllianceId, diplomaties, hoveredSector, isDragging]);

    useEffect(() => {
        const frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, [draw]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const mouseX = (e.clientX - rect.left - rect.width / 2) / zoom;
        const mouseY = (e.clientY - rect.top - rect.height / 2) / zoom;
        const tx = Math.floor((mouseX - offset.x) / TILE_SIZE + center.x);
        const ty = Math.floor((mouseY - offset.y) / TILE_SIZE + center.y);

        if (isDragging) {
            const dx = (e.clientX - lastMousePos.x) / zoom;
            const dy = (e.clientY - lastMousePos.y) / zoom;
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else {
            const baseAt = bases.find(b => b.coordenada_x === tx && b.coordenada_y === ty);
            setHoveredSector({ x: tx, y: ty, base: baseAt });
        }
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
            onMouseLeave={() => { setIsDragging(false); setHoveredSector(null); }}
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
