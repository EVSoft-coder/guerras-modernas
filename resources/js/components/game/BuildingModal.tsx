import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hammer, Clock, ArrowUpCircle, Info } from 'lucide-react';

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

    const config = gameConfig.buildings[building.tipo] || { name: building.nome, cost: {}, time_base: 0 };
    const nextLevel = (building.nivel || 0) + 1;
    
    // Simplificação do cálculo de custo (base * nível)
    const renderCost = (type: string, amount: number) => {
        if (!amount) return null;
        const total = amount * nextLevel;
        return (
            <div key={type} className="flex items-center justify-between bg-black/20 p-2 rounded border border-white/5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">{type}</span>
                <span className="text-sm font-mono font-bold text-orange-400">{total.toLocaleString()}</span>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-white/10 text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-sky-500 to-orange-500 opacity-50"></div>
                
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <DialogTitle className="text-xl font-black text-uppercase ls-1 tracking-tighter flex items-center gap-2">
                            <Info className="text-sky-500" size={20} />
                            {config.name || building.nome}
                        </DialogTitle>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                            NÍVEL {building.nivel}
                        </Badge>
                    </div>
                    <DialogDescription className="text-neutral-400 text-xs italic mt-2">
                        Setor operacional da base designado para {config.name?.toLowerCase() || 'infraestrutura'}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Imagem de Referência */}
                    <div className="w-full aspect-video bg-black/40 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden relative">
                        <img 
                            src={`/images/edificios/${building.tipo}/lvl_1.png`} 
                            className="w-32 h-32 object-contain opacity-80" 
                            alt="Preview"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                    </div>

                    {/* Custos de Melhoria */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase text-sky-500 tracking-widest flex items-center gap-2">
                            <Hammer size={12} /> Recursos Necessários para Nível {nextLevel}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(config.cost).map(([type, amount]: any) => renderCost(type, amount))}
                        </div>
                    </div>

                    {/* Tempo de Construção */}
                    <div className="flex items-center gap-3 bg-sky-500/5 p-3 rounded-lg border border-sky-500/20">
                        <Clock className="text-sky-500" size={20} />
                        <div>
                            <div className="text-[10px] uppercase font-bold text-sky-400">Tempo de Integração</div>
                            <div className="text-lg font-mono font-bold text-white">
                                {Math.floor((config.time_base * nextLevel) / 60)}m {Math.floor((config.time_base * nextLevel) % 60)}s
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button 
                        onClick={() => onUpgrade(building.tipo)}
                        disabled={isUpgrading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest py-6 rounded-xl shadow-lg shadow-orange-900/20 flex gap-2"
                    >
                        <ArrowUpCircle size={20} />
                        {isUpgrading ? 'TRANSMITINDO ORDENS...' : 'AUTORIZAR MELHORIA'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
