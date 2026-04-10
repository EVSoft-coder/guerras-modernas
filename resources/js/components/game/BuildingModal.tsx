import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, Zap, Shield, Info, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface BuildingModalProps {
    isOpen: boolean;
    onClose: () => void;
    building: any;
    gameConfig: any;
    onUpgrade: (tipo: string) => void;
    isUpgrading: boolean;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ isOpen, onClose, building, gameConfig, onUpgrade, isUpgrading }) => {
    if (!building) return null;

    const config = gameConfig.buildings[building.tipo] || { name: building.nome, cost: {}, time_base: 0, description: '' };
    const nextLevel = (building.nivel || 0) + 1;
    
    // Motor de Ativos Evolutivo
    const getBuildingImage = (tipo: string, nivel: number) => {
        const evolutionLevels = [6, 5, 4, 3, 2, 1];
        for (const lvl of evolutionLevels) {
            if (nivel >= lvl) return `/images/edificios/${tipo}/lvl_${lvl}.png`;
        }
        return `/images/edificios/${tipo}/lvl_1.png`;
    };

    const currentImage = getBuildingImage(building.tipo, building.nivel);

    const renderCost = (resourceType: string, amount: number) => {
        if (!amount) return null;
        const total = amount * nextLevel;
        
        const resourceIcons: Record<string, string> = {
            'suprimentos': '📦',
            'combustivel': '⛽',
            'municoes': '🚀',
            'pessoal': '👤'
        };

        return (
            <div key={resourceType} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:border-sky-500/30 transition-colors">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{resourceIcons[resourceType] || '💎'}</span>
                    <span className="text-[10px] uppercase text-neutral-400 font-black tracking-widest">{resourceType}</span>
                </div>
                <span className="text-sm font-mono font-black text-sky-400">{total.toLocaleString()}</span>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-neutral-950/95 border-white/10 text-white overflow-hidden backdrop-blur-2xl p-0 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)]">
                {/* Cabeçalho do Dossiê */}
                <div className="relative h-56 w-full bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent z-10"></div>
                    
                    {/* Imagem do Edifício com Animação de Entrada */}
                    <motion.img 
                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        key={currentImage}
                        src={currentImage} 
                        className="w-48 h-48 object-contain z-0 filter drop-shadow-[0_0_30px_rgba(14,165,233,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all duration-700" 
                        alt="Dossie Preview"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('lvl_1.png')) {
                                target.src = `/images/edificios/${building.tipo}/lvl_1.png`;
                            }
                        }}
                    />
                    
                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 font-black px-3 py-1 rounded-full text-[10px] tracking-widest uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                            SETOR: {building.tipo.toUpperCase()}
                        </Badge>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    <DialogHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-white">
                                    {config.name || building.nome}
                                </DialogTitle>
                                <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-sky-500">INTEGRIDADE ESTRUTURAL: 100%</span>
                                    <span className="h-1 w-1 bg-neutral-700 rounded-full"></span>
                                    <span>NÍVEL {building.nivel}</span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Descrição Tática */}
                    <div className="bg-white/5 p-4 rounded-2xl border-l-2 border-sky-500 flex gap-3 italic">
                        <Info className="text-sky-500 shrink-0" size={16} />
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                            {config.description || "Esta estrutura é vital para a logística e projeção de força das nossas operações militares."}
                        </p>
                    </div>

                    {/* Especificasões / Comparação */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                            <h4 className="text-[9px] font-black text-neutral-500 uppercase mb-2 tracking-widest">Produção Atual</h4>
                            <div className="text-xl font-mono font-black text-white flex items-center gap-2">
                                <Zap className="text-sky-500" size={16} />
                                {70 + (building.nivel * 10)}%
                            </div>
                        </div>
                        <div className="bg-orange-600/10 p-4 rounded-2xl border border-orange-500/30 flex flex-col items-center group hover:bg-orange-600/20 transition-colors">
                            <h4 className="text-[9px] font-black text-orange-500 uppercase mb-2 tracking-widest">Próximo Nível</h4>
                            <div className="text-xl font-mono font-black text-orange-500 flex items-center gap-2">
                                <TrendingUp size={16} />
                                +10%
                            </div>
                        </div>
                    </div>

                    {/* Custos de Logística */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-2">
                                <Hammer size={12} className="text-orange-500" /> Logística de Upgrade
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase font-mono">
                                <Clock size={12} /> {Math.floor((config.time_base * nextLevel) / 60)}m {Math.floor((config.time_base * nextLevel) % 60)}s
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            onClick={() => onUpgrade(building.tipo)}
                            disabled={isUpgrading}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.3)] border-t border-white/20 flex flex-col gap-0.5 group"
                        >
                            <span className="text-lg group-hover:scale-105 transition-transform">
                                {isUpgrading ? 'A TRANSMITIR ORDENS...' : 'AUTORIZAR EVOLUÇÃO'}
                            </span>
                            {!isUpgrading && <span className="text-[8px] opacity-70">NÍVEL {nextLevel} CONFIRMADO PELO COMANDO</span>}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
