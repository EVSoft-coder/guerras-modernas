import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, Zap, Shield, Info, TrendingUp, AlertTriangle, ChevronRight, X, Loader2, Target as Sword, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logger } from '../../../../src/core/Logger';
import { getEvolutionLevelAsset, calculateBuildingCost, calculateConstructionTime, calculateResourceProduction, parseResourceValue } from '@/lib/game-utils';
import { getBuildingAsset, getUnitAsset } from '@/utils/assetMapper';

interface BuildingModalProps {
    isOpen: boolean;
    onClose: () => void;
    building: any;
    gameConfig: any;
    onUpgrade: (buildingType: string) => void;
    onTrain: (unidade: string, quantidade: number) => void;
    isUpgrading: boolean;
    isTraining: boolean;
    population: any;
    unitTypes?: any[];
    resources: any;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ 
    isOpen, onClose, building, gameConfig, 
    onUpgrade, onTrain, isUpgrading, isTraining, population, unitTypes, resources
}) => {
    if (!building) return null;

    const buildingsConfig = gameConfig?.buildings || {};
    const config = buildingsConfig[building.buildingType] || { 
        name: building.nome || 'Estrutura Desconhecida', 
        cost: {}, 
        time_base: 0, 
        description: 'Informação tática indisponível para este setor.' 
    };

    const nextLevel = (building.nivel || 0) + 1;
    const isBuilt = (building.nivel || 0) > 0;
    
    const [usePlaceholder, setUsePlaceholder] = useState(false);
    const [trainQty, setTrainQty] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

    const currentImage = usePlaceholder ? getBuildingAsset(building.buildingType, 'blueprint') : getBuildingAsset(building.buildingType, isBuilt ? getEvolutionLevelAsset(building.nivel) : 1);

    useEffect(() => {
        if (building) {
            setTrainQty(1);
            setSelectedUnit(null);
        }
        setUsePlaceholder(false);
    }, [building.buildingType, building.nivel]);

    const renderCost = (resourceType: string, baseAmount: number) => {
        if (!baseAmount) return null;
        const totalCost = calculateBuildingCost(baseAmount, building.nivel || 0);
        const playerAmount = parseResourceValue(resources?.[resourceType] || 0);
        const hasEnough = playerAmount >= totalCost;
        
        const resourceIcons: Record<string, string> = { 'suprimentos': '📦', 'combustivel': '⛽', 'municoes': '🚀', 'pessoal': '👤' };
        const resourceColors: Record<string, string> = { 'suprimentos': 'text-sky-400', 'combustivel': 'text-orange-400', 'municoes': 'text-red-400', 'pessoal': 'text-emerald-400' };

        return (
            <div key={resourceType} className={`flex items-center justify-between bg-black/40 p-3.5 rounded-2xl border ${hasEnough ? 'border-white/5' : 'border-red-500/30'} group transition-all hover:bg-white/[0.02]`}>
                <div className="flex items-center gap-3">
                    <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{resourceIcons[resourceType] || '💎'}</span>
                    <span className="text-[10px] uppercase text-neutral-500 font-black tracking-widest">{resourceType}</span>
                </div>
                <div className={`text-sm font-mono font-black ${hasEnough ? resourceColors[resourceType] : 'text-red-500'}`}>
                    {totalCost.toLocaleString()}
                </div>
            </div>
        );
    };

    const totalTime = calculateConstructionTime(config.time_base, building.nivel || 0);
    const timeFormatted = `${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`;

    const canAfford = config.cost ? Object.entries(config.cost).every(([type, amount]) => {
        const cost = calculateBuildingCost(type === 'pessoal' ? 0 : amount as number, building.nivel || 0);
        return type === 'pessoal' ? (population?.available ?? 0) >= (amount as number) : parseResourceValue(resources?.[type] || 0) >= cost;
    }) : true;

    const tipoLower = building.buildingType?.toLowerCase();
    const isMilitary = ['quartel', 'aerodromo'].includes(tipoLower);
    const availableUnits = isMilitary ? (unitTypes || []).filter(ut => {
        const k = ut.name.toLowerCase();
        if (tipoLower === 'quartel') return ['infantaria', 'blindado', 'tanque', 'agente', 'politico'].some(s => k.includes(s));
        if (tipoLower === 'aerodromo') return ['helicoptero', 'drone'].some(s => k.includes(s));
        return false;
    }) : [];

    useEffect(() => {
        if (isMilitary && availableUnits.length > 0 && !selectedUnit) setSelectedUnit(availableUnits[0].name);
    }, [building.buildingType, isMilitary, availableUnits]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-[#020406] border-white/10 text-white overflow-hidden backdrop-blur-3xl p-0 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[90vh] md:h-auto">
                {/* LEFT BLOCK: VISUAL INTERFACE */}
                <div className="w-full md:w-[45%] bg-[#050709] relative flex flex-col items-center justify-center p-10 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    {/* STATUS RING */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed transition-all duration-1000 ${isBuilt ? 'border-sky-500/20 animate-[spin_20s_linear_infinite]' : 'border-orange-500/20 animate-pulse'}`} />
                    
                    <Badge className={`absolute top-8 left-8 ${isBuilt ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'} font-black px-5 py-2.5 rounded-full text-[10px] tracking-widest uppercase flex items-center gap-3 backdrop-blur-xl`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isBuilt ? 'bg-sky-500 shadow-[0_0_10px_#0ea5e9]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`} />
                        {isBuilt ? 'SISTEMA_OPERACIONAL' : 'ASSINATURA_PLANEADA'}
                    </Badge>

                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 group cursor-crosshair">
                        <div className={`absolute inset-0 blur-[80px] opacity-20 group-hover:opacity-40 transition-all ${isBuilt ? 'bg-sky-500' : 'bg-orange-500'}`} />
                        <img 
                            src={currentImage} 
                            className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-700" 
                            alt={config.name}
                            onError={() => setUsePlaceholder(true)}
                        />
                    </motion.div>

                    <div className="mt-12 w-full space-y-4 z-10 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-1">Nível de Autorização</span>
                            <div className="text-7xl font-black text-white italic tracking-tighter leading-none">{building.nivel || 0}</div>
                        </div>
                        <div className="flex gap-1 justify-center">
                            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= (building.nivel % 8 || 0) ? 'w-6 bg-sky-500' : 'w-2 bg-white/5'}`} />)}
                        </div>
                    </div>
                </div>

                {/* RIGHT BLOCK: DATA & CONTROLS */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-black/40 to-transparent relative">
                    <button onClick={onClose} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                    
                    <div className="space-y-10 overflow-y-auto pr-4 custom-scrollbar">
                        <header className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20"><Cpu size={16} className="text-sky-500" /></div>
                                <span className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.4em]">Protocolo_{tipoLower}</span>
                            </div>
                            <DialogTitle className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{config.name}</DialogTitle>
                            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-md">{config.description}</p>
                        </header>

                        {isMilitary ? (
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-3">
                                    <Sword size={14} className="text-emerald-500" /> Mobilização_Batalhão
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {availableUnits.map(unit => (
                                        <button 
                                            key={unit.id}
                                            onClick={() => setSelectedUnit(unit.name)}
                                            className={`p-4 rounded-[1.5rem] border transition-all flex items-center gap-4 relative overflow-hidden group ${selectedUnit === unit.name ? 'bg-emerald-500/10 border-emerald-500/40 shadow-2xl' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                                        >
                                            <img src={getUnitAsset(unit.name)} className="w-10 h-10 object-contain brightness-75 group-hover:brightness-110" alt={unit.name} />
                                            <div className="flex flex-col items-start translate-y-2">
                                                <span className="text-[10px] font-black uppercase text-white">{unit.name}</span>
                                                <span className="text-[8px] font-mono text-neutral-500">{unit.build_time}s</span>
                                            </div>
                                            <div className="absolute top-2 right-4 text-[12px] font-black text-emerald-500 opacity-60">#{unit.id}</div>
                                        </button>
                                    ))}
                                </div>
                                {selectedUnit && (
                                    <div className="bg-black/60 p-6 rounded-[2rem] border border-white/5 space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Contingente_Mobilizado</span>
                                            <input type="number" value={trainQty} onChange={e => setTrainQty(Math.max(1, parseInt(e.target.value)))} className="bg-transparent border-none text-right font-mono text-emerald-400 font-black text-xl w-24 focus:ring-0" />
                                        </div>
                                        <Button onClick={() => onTrain(selectedUnit, trainQty)} disabled={isTraining} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all">
                                            {isTraining ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar_Diretiva_Mobilização'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-3">
                                        <Hammer size={14} className="text-orange-500" /> Logística_Estrutural
                                    </h4>
                                    <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-[9px] font-black text-orange-400">
                                        <Clock size={10} /> {timeFormatted}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {config.cost && Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isMilitary && (
                        <DialogFooter className="mt-10">
                            <Button 
                                onClick={() => onUpgrade(building.buildingType)}
                                disabled={isUpgrading || !canAfford}
                                className={`w-full h-20 md:h-24 font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl relative overflow-hidden transition-all active:scale-[0.98] ${canAfford ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-neutral-900 text-neutral-700 cursor-not-allowed border border-white/5'}`}
                            >
                                <div className="flex flex-col items-center gap-1 z-10 transition-transform group-hover:scale-105">
                                    <span className="text-xl">{isUpgrading ? 'TRANSMITINDO_DADOS...' : (canAfford ? (building.nivel === 0 ? 'CONSTRUIR_SETOR' : 'UPGRADE_ESTRUTURAL') : 'INSOLVÊNCIA_TÉCNICA')}</span>
                                    {canAfford && <span className="text-[8px] opacity-60 tracking-[0.5em]">Autorizar_Execução_Nível_{building.nivel + 1}</span>}
                                </div>
                                {canAfford && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
                            </Button>
                        </DialogFooter>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
