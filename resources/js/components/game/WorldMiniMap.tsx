import React, { useRef, useEffect } from 'react';

interface WorldMiniMapProps {
    center: { x: number, y: number };
    bases: any[];
    onJump: (x: number, y: number) => void;
}

export const WorldMiniMap: React.FC<WorldMiniMapProps> = ({ center, bases, onJump }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 150;
        ctx.clearRect(0, 0, size, size);

        // Fundo Tático
        ctx.fillStyle = '#05080f';
        ctx.fillRect(0, 0, size, size);

        // Renderizar Bases (Pontos)
        bases.forEach(base => {
            const bx = (base.coordenada_x / 1000) * size;
            const by = (base.coordenada_y / 1000) * size;
            
            ctx.fillStyle = base.ownerId ? '#ef4444' : '#f59e0b'; // Inimigo ou Rebelde
            if (base.aliancaId) ctx.fillStyle = '#06b6d4'; // Aliado (simplificado no minimap)
            
            ctx.fillRect(bx, by, 1, 1);
        });

        // Viewport Indicator (Rectângulo do Centro)
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 1;
        const cx = (center.x / 1000) * size;
        const cy = (center.y / 1000) * size;
        ctx.strokeRect(cx - 5, cy - 5, 10, 10);
        
        // Mira tática no centro
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy); ctx.lineTo(cx + 3, cy);
        ctx.moveTo(cx, cy - 3); ctx.lineTo(cx, cy + 3);
        ctx.stroke();

    }, [center, bases]);

    const handleClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = Math.floor(((e.clientX - rect.left) / 150) * 1000);
        const y = Math.floor(((e.clientY - rect.top) / 150) * 1000);
        onJump(x, y);
    };

    return (
        <div className="absolute bottom-24 right-6 z-50 p-1 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl group transition-all hover:scale-110">
            <div className="absolute inset-0 bg-sky-500/5 animate-pulse pointer-events-none" />
            <canvas 
                ref={canvasRef} 
                width={150} 
                height={150} 
                className="cursor-crosshair"
                onClick={handleClick}
            />
            <div className="absolute top-1 left-2 font-mono text-[8px] text-sky-400/70 pointer-events-none">
                GLOBAL_SAT_FEED
            </div>
        </div>
    );
};
