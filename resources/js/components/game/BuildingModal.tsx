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
            <DialogContent className="max-w-4xl bg-[#020406]/90 border-white/5 text-white overflow-hidden backdrop-blur-3xl p-0 rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[90vh] md:h-auto border">
                {/* LEFT BLOCK: VISUAL INTERFACE */}
                <div className="w-full md:w-[45%] bg-black/40 relative flex flex-col items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                    <div className="absolute inset-0 scanline-effect opacity-[0.05]" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    
                    {/* STATUS RING */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed transition-all duration-1000 ${isBuilt ? 'border-sky-500/10 animate-[spin_30s_linear_infinite]' : 'border-orange-500/10 animate-pulse'}`} />
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full border border-white/5`} />
                    
                    <Badge className={`absolute top-10 left-10 ${isBuilt ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'} font-black px-6 py-3 rounded-2xl text-[9px] tracking-[0.3em] uppercase flex items-center gap-3 backdrop-blur-2xl`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isBuilt ? 'bg-sky-500 shadow-[0_0_10px_#0ea5e9]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`} />
                        {isBuilt ? 'STATUS_OPERACIONAL' : 'ASSINATURA_PENDENTE'}
                    </Badge>

                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "circOut" }} className="relative z-10 group cursor-crosshair">
                        <div className={`absolute inset-0 blur-[100px] opacity-10 group-hover:opacity-30 transition-all duration-1000 ${isBuilt ? 'bg-sky-500' : 'bg-orange-500'}`} />
                        <img 
                            src={currentImage} 
                            className="w-72 h-72 md:w-96 md:h-96 object-contain relative z-10 drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-1000 ease-out" 
                            alt={config.name}
                            onError={() => setUsePlaceholder(true)}
                        />
                    </motion.div>

                    <div className="mt-16 w-full space-y-6 z-10 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.6em] mb-2">Auth_Level_Signature</span>
                            <div className="text-8xl font-black text-white italic tracking-tighter leading-none font-military-mono">
                                {(building.nivel || 0).toString().padStart(2, '0')}
                            </div>
                        </div>
                        <div className="flex gap-1.5 justify-center">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i <= (building.nivel % 12 || 0) ? 'w-5 bg-sky-500 shadow-[0_0_8px_#0ea5e9]' : 'w-1.5 bg-white/5'}`} />)}
                        </div>
                    </div>
                </div>

                {/* RIGHT BLOCK: DATA & CONTROLS */}
                <div className="flex-1 p-10 md:p-14 flex flex-col justify-between bg-gradient-to-br from-black/20 via-transparent to-transparent relative">
                    <button onClick={onClose} className="absolute top-10 right-10 text-neutral-600 hover:text-white transition-all p-2.5 hover:bg-white/5 rounded-2xl active:scale-90"><X size={20} /></button>
                    
                    <div className="space-y-12 overflow-y-auto pr-6 custom-scrollbar max-h-[60vh]">
                        <header className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-sky-500/10 rounded-2xl border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.1)]"><Cpu size={18} className="text-sky-500" /></div>
                                <span className="text-[9px] font-black text-sky-500/40 uppercase tracking-[0.5em] font-military-mono">Protocolo_{tipoLower}_v3.9</span>
                            </div>
                            <DialogTitle className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">{config.name}</DialogTitle>
                            <DialogDescription className="text-[11px] text-neutral-500 font-medium leading-relaxed max-w-lg">
                                {config.description}
                            </DialogDescription>
                        </header>

                        {isMilitary ? (
                            <div className="space-y-8">
                                <h4 className="text-[9px] font-black uppercase text-neutral-400 tracking-[0.4em] flex items-center gap-4">
                                    <div className="w-8 h-[1px] bg-emerald-500/30" />
                                    Mobilização_Direta
                                    <div className="flex-1 h-[1px] bg-white/[0.03]" />
                                </h4>
                                <div className="grid grid-cols-2 gap-5">
                                    {availableUnits.map(unit => (
                                        <button 
                                            key={unit.id}
                                            onClick={() => setSelectedUnit(unit.name)}
                                            className={`p-5 rounded-[2rem] border transition-all duration-500 flex items-center gap-5 relative overflow-hidden group ${selectedUnit === unit.name ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_20px_40px_rgba(16,185,129,0.1)] scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}
                                        >
                                            <div className="relative">
                                                <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity ${selectedUnit === unit.name ? 'opacity-30 bg-emerald-500' : 'bg-white'}`} />
                                                <img src={getUnitAsset(unit.name)} className="w-12 h-12 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" alt={unit.name} />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-[11px] font-black uppercase text-white tracking-widest">{unit.name}</span>
                                                <span className="text-[9px] font-black font-military-mono text-neutral-600 mt-1 uppercase tracking-widest">T_{unit.build_time}S</span>
                                            </div>
                                            <div className={`absolute top-3 right-5 text-[10px] font-black font-military-mono transition-colors ${selectedUnit === unit.name ? 'text-emerald-500' : 'text-neutral-800'}`}>0x{unit.id}</div>
                                        </button>
                                    ))}
                                </div>
                                {selectedUnit && (
                                    <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px]" />
                                        <div className="flex justify-between items-center px-2">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase font-black text-neutral-600 tracking-[0.4em] mb-1">Quota_Mobilização</span>
                                                <span className="text-[8px] text-emerald-500/40 uppercase font-black tracking-widest">Aguardando_Input...</span>
                                            </div>
                                            <input type="number" value={trainQty} onChange={e => setTrainQty(Math.max(1, parseInt(e.target.value)))} className="bg-transparent border-none text-right font-military-mono text-emerald-400 font-black text-4xl w-32 focus:ring-0" />
                                        </div>
                                        <Button onClick={() => onTrain(selectedUnit, trainQty)} disabled={isTraining} className="w-full h-20 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95 transition-all group/btn relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                            <span className="relative z-10 flex items-center justify-center gap-4">
                                                {isTraining ? <Loader2 size={18} className="animate-spin" /> : <Sword size={18} />}
                                                Confirmar_Diretiva
                                            </span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[9px] font-black uppercase text-neutral-400 tracking-[0.4em] flex items-center gap-4">
                                        <div className="w-8 h-[1px] bg-orange-500/30" />
                                        Custos_Operacionais
                                        <div className="flex-1 h-[1px] bg-white/[0.03]" />
                                    </h4>
                                    <div className="flex items-center gap-3 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 text-[10px] font-black text-orange-400 font-military-mono uppercase tracking-widest">
                                        <Clock size={12} /> {timeFormatted}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {config.cost && Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isMilitary && (
                        <DialogFooter className="mt-12">
                            <Button 
                                onClick={() => onUpgrade(building.buildingType)}
                                disabled={isUpgrading || !canAfford}
                                className={`w-full h-24 md:h-28 font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl relative overflow-hidden transition-all active:scale-[0.98] group/upgrade ${canAfford ? 'bg-sky-500 hover:bg-sky-400 text-black shadow-[0_0_50px_rgba(14,165,233,0.3)]' : 'bg-neutral-900 text-neutral-700 cursor-not-allowed border border-white/5 opacity-50'}`}
                            >
                                <div className="flex flex-col items-center gap-2 z-10 transition-transform group-hover/upgrade:scale-105">
                                    <span className="text-2xl md:text-3xl font-black italic tracking-tighter">
                                        {isUpgrading ? ' TRANSMITINDO...' : (canAfford ? (building.nivel === 0 ? 'CONSTRUIR_BASE' : 'UPGRADE_SISTEMA') : 'INSOLVÊNCIA')}
                                    </span>
                                    {canAfford && <span className="text-[9px] opacity-40 tracking-[0.6em] font-black">Autorizar_Execução_Nível_{(building.nivel || 0) + 1}</span>}
                                </div>
                                {canAfford && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/upgrade:translate-x-full transition-transform duration-1000" />}
                                {canAfford && <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40" />}
                            </Button>
                        </DialogFooter>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
