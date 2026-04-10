import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, Zap, Shield, Info, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const buildingsConfig = gameConfig?.buildings || {};
    const config = buildingsConfig[building.tipo] || { 
        name: building.nome || 'Estrutura Desconhecida', 
        cost: {}, 
        time_base: 0, 
        description: 'Informação tática indisponível para este setor.' 
    };

    const nextLevel = (building.nivel || 0) + 1;
    
    const getBuildingImage = (tipo: string, nivel: number) => {
        const evolutionLevels = [6, 5, 4, 3, 2, 1];
        const folder = tipo || 'qg';
        for (const lvl of evolutionLevels) {
            if (nivel >= lvl) return `/images/edificios/${folder}/lvl_${lvl}.png`;
        }
        return `/images/edificios/${folder}/lvl_1.png`;
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
            <motion.div 
                key={resourceType}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:border-sky-500/30 transition-all group"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg group-hover:scale-110 transition-transform">{resourceIcons[resourceType] || '💎'}</span>
                    <span className="text-[9px] uppercase text-neutral-400 font-black tracking-widest">{resourceType}</span>
                </div>
                <span className="text-sm font-mono font-black text-sky-400">{total.toLocaleString()}</span>
            </motion.div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-neutral-950/95 border-white/10 text-white overflow-hidden backdrop-blur-2xl p-0 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)]">
                <AnimatePresence mode="wait">
                    {!building.tipo ? (
                        <div className="p-12 text-center space-y-4">
                            <AlertTriangle className="mx-auto text-orange-500 animate-pulse" size={48} />
                            <h3 className="text-xl font-black uppercase tracking-tighter">Erro de Telemetria</h3>
                            <p className="text-neutral-500 text-[10px] uppercase">Assinatura do edifício não reconhecida.</p>
                            <Button onClick={onClose} variant="outline" className="mt-4">Fechar</Button>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col md:flex-row h-full max-h-[90vh]"
                        >
                            {/* Lado Esquerdo: Visual & Status */}
                            <div className="md:w-1/2 relative bg-gradient-to-br from-neutral-900 to-black p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                
                                <Badge className="absolute top-6 left-6 bg-sky-500/10 text-sky-400 border-sky-500/20 font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-2xl">
                                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                                    STATUS: OPERACIONAL
                                </Badge>

                                <motion.div
                                    initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
                                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-sky-500/20 blur-[60px] rounded-full animate-pulse group-hover:bg-orange-500/20 transition-colors"></div>
                                    <img 
                                        src={currentImage} 
                                        className="w-64 h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(14,165,233,0.5)]" 
                                        alt="Preview"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (!target.src.includes('lvl_1.png')) target.src = `/images/edificios/${building.tipo}/lvl_1.png`;
                                        }}
                                    />
                                </motion.div>

                                <div className="mt-8 w-full space-y-4 z-10">
                                    <div className="text-center">
                                        <h2 className="text-sm font-black text-neutral-500 uppercase tracking-[0.3em]">Nível Estrutural</h2>
                                        <div className="text-6xl font-black text-white italic drop-shadow-lg">{building.nivel || 0}</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 justify-center">
                                        {[1,2,3,4,5,6].map(lvl => (
                                            <div key={lvl} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${lvl <= building.nivel ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Lado Direito: Inteligência & Logística */}
                            <div className="md:w-1/2 p-8 flex flex-col bg-neutral-900/50">
                                <DialogHeader className="mb-6">
                                    <div className="space-y-1">
                                        <DialogTitle className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
                                            {config.name}
                                        </DialogTitle>
                                        <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Shield size={10} /> Setor de {building.tipo.replace('_', ' ').toUpperCase()}
                                        </p>
                                    </div>
                                </DialogHeader>

                                {/* Dossiê Tático */}
                                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="bg-black/40 p-5 rounded-2xl border-l-4 border-sky-600 flex gap-4 shadow-xl">
                                        <Info className="text-sky-500 shrink-0" size={20} />
                                        <p className="text-xs text-neutral-300 leading-relaxed italic">
                                            {config.description}
                                        </p>
                                    </div>

                                    {/* Comparativos */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                                            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Produção</span>
                                            <div className="text-xl font-mono font-black text-white">+{70 + ((building.nivel || 0) * 10)}%</div>
                                        </div>
                                        <div className="bg-sky-600/10 p-4 rounded-2xl border border-sky-500/30 space-y-1">
                                            <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Upgrade</span>
                                            <div className="text-xl font-mono font-black text-sky-400 flex items-center gap-1">
                                                <TrendingUp size={16} /> +10%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logística de Recursos */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <h4 className="text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-2">
                                                <Hammer size={12} className="text-orange-500" /> Requisição de Materiais
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase font-mono">
                                                <Clock size={12} /> {Math.floor(((config.time_base || 0) * nextLevel) / 60)}m {Math.floor(((config.time_base || 0) * nextLevel) % 60)}s
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {config.cost ? Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount)) : null}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-8">
                                    <Button 
                                        onClick={() => onUpgrade(building.tipo)}
                                        disabled={isUpgrading}
                                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-2xl shadow-[0_0_40px_rgba(14,165,233,0.3)] border-t border-white/20 flex items-center justify-center gap-3 group transition-all"
                                    >
                                        <span className="text-xl group-hover:translate-x-1 transition-transform">
                                            {isUpgrading ? 'AUTORIZANDO...' : 'MELHORAR ESTRUTURA'}
                                        </span>
                                        {!isUpgrading && <ChevronRight className="group-hover:translate-x-2 transition-transform" />}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};
