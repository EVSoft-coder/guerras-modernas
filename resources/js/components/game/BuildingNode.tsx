import React from 'react';
import { BuildingLayout } from '@/config/buildingLayout';

interface BuildingNodeProps {
    type: string;
    level: number;
    layout: BuildingLayout;
    onClick: () => void;
    isConstructing?: boolean;
}

/**
 * BuildingNode — ANCHOR REAL V39
 * Renderização bottom-center para alinhamento perfeito com o solo.
 */
export const BuildingNode: React.FC<BuildingNodeProps> = ({ 
    type, level, layout, onClick, isConstructing 
}) => {
    return (
        <div 
            className="building-node"
            onClick={onClick}
            style={{ 
                position: 'absolute',
                left: `${layout.x}px`,
                top: `${layout.y}px`,
                height: `${layout.h}px`, // ALTURA OBRIGATÓRIA (Fase 2)
                width: 'auto',          // LARGURA FLEXÍVEL (Auto-ajuste)
                zIndex: Math.floor(layout.y), // PROFUNDIDADE CORRETA (Fase 5)
                transform: 'translate(-50%, -100%)', // ANCHOR REAL
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
            }}
        >
            {/* PONTO DE DIAGNÓSTICO (ANCHOR REAL) */}
            <div className="anchor-point" 
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    width: '6px',
                    height: '6px',
                    background: '#ff0000',
                    borderRadius: '50%',
                    transform: 'translate(-50%, 50%)',
                    zIndex: 9999,
                    boxShadow: '0 0 10px #ff0000',
                    pointerEvents: 'none'
                }} 
            />

            <img 
                src={`/images/buildings/${layout.assetName}`}
                alt={type}
                style={{
                    height: '100%',     // Preenche a altura H definida no layout
                    width: 'auto',       // Mantém o rácio de aspecto original
                    display: 'block',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    filter: isConstructing ? 'grayscale(0.8) opacity(0.7)' : 'none',
                    pointerEvents: 'none'
                }}
            />
            
            {/* Overlay de Construção */}
            {isConstructing && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,165,0,0.1) 10px, rgba(255,165,0,0.1) 20px)',
                    pointerEvents: 'none'
                }} />
            )}
        </div>
    );
};

export default BuildingNode;
