import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Shield, Target, Activity, Zap, ExternalLink, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUnitAsset } from '@/utils/assetMapper';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface GarrisonPanelProps {
    tropas: any[];
    reinforcements: any[];
    stationedOutside: any[];
    gameConfig: any;
}

export const GarrisonPanel: React.FC<GarrisonPanelProps> = ({ 
    tropas = [], 
    reinforcements = [], 
    stationedOutside = [], 
    gameConfig 
}) => {
    const [activeTab, setActiveTab] = useState<'local' | 'received' | 'sent'>('local');
    const unitsConfig = gameConfig?.units || {};

    const handleRecall = (id: number) => {
        if (confirm('Deseja retirar estas tropas e trazê-las de volta?')) {
            router.post(`/reinforcements/recall/${id}`, {}, {
                onSuccess: () => {
                    // Toast handled by bus usually
                }
            });
        }
    };

    const renderUnitList = (items: any[], type: 'local' | 'received' | 'sent') => {
        if (!items || items.length === 0) {
            return (
                <div className="col-span-full py-16 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] relative overflow-hidden">
                    <Activity className="mx-auto text-neutral-800 mb-4 opacity-20" size={40} />
                    <span className="text-[11px] uppercase font-black text-neutral-600 tracking-[0.4em] block">
                        Sem Unidades Detetadas
                    </span>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-3">
                {items.map((t, idx) => {
                    // Normalização de dados dependendo da origem
                    const unitName = type === 'local' ? t.tipo : (t.type?.name || 'unidade');
                    const quantity = type === 'local' ? t.quantidade : t.quantity;
                    const config = unitsConfig[unitName] || {};
                    const displayName = config.name || unitName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    return (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black/40 rounded-xl border border-white/10 p-1 flex items-center justify-center">
                                    <img 
                                        src={getUnitAsset(unitName)} 
                                        className="w-full h-full object-contain" 
                                        alt={displayName}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-white tracking-widest">{displayName}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{quantity.toLocaleString()}</span>
                                        {type !== 'local' && (
                                            <span className="text-[7px] text-neutral-500 uppercase font-bold">
                                                {type === 'received' ? `De: ${t.origin_base?.jogador?.username}` : `Em: ${t.target_base?.jogador?.username}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {type === 'sent' && (
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => handleRecall(t.id)}
                                    className="h-8 px-3 text-[8px] font-black uppercase bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20"
                                >
                                    <ArrowLeft size={12} className="mr-1" /> Retirar
                                </Button>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <Card className="tactical-glass overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] rounded-[2.5rem] relative group border-t-emerald-500/20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
            
            <CardHeader className="py-5 border-b border-white/5 bg-white/[0.01]">
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500 flex items-center gap-3">
                            <Users className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" size={18} />
                            Logística_Guarnição
                        </CardTitle>
                    </div>

                    <div className="flex gap-1 bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        {[
                            { id: 'local', label: 'Local', count: tropas.length },
                            { id: 'received', label: 'Aliados', count: reinforcements.length },
                            { id: 'sent', label: 'Exportadas', count: stationedOutside.length }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] translate-y-[-1px]' 
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && <span className={`ml-2 opacity-60 text-[8px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-black/20' : 'bg-white/5'}`}>{tab.count}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="py-6 min-h-[220px] relative">
                {/* HUD Decoration */}
                <div className="absolute top-0 right-4 w-[1px] h-full bg-white/[0.02] hidden md:block" />
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {activeTab === 'local' && renderUnitList(tropas, 'local')}
                        {activeTab === 'received' && renderUnitList(reinforcements, 'received')}
                        {activeTab === 'sent' && renderUnitList(stationedOutside, 'sent')}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[8px] font-black text-neutral-600 tracking-[0.6em] uppercase flex items-center gap-2">
                        <Activity size={10} className="text-emerald-500/50" />
                        GARRISON_PROTO_V11
                    </span>
                    <div className="flex gap-1.5">
                        {[1,2,3,4].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i <= 2 ? 'bg-emerald-500/50' : 'bg-white/5'}`} />)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
