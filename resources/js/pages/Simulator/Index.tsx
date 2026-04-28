import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { 
    Calculator, 
    Sword, 
    Shield, 
    TrendingUp, 
    AlertCircle, 
    Zap, 
    ChevronRight, 
    RefreshCw,
    Moon,
    Sun,
    Trophy,
    Skull
} from 'lucide-react';
import { toast } from 'sonner';

interface UnitType {
    id: number;
    name: string;
    display_name: string;
    attack: number;
    defense: number;
}

interface Props {
    unitTypes: UnitType[];
}

export default function Simulator({ unitTypes }: Props) {
    const [attackerUnits, setAttackerUnits] = useState<Record<number, number>>({});
    const [defenderUnits, setDefenderUnits] = useState<Record<number, number>>({});
    const [wallLevel, setWallLevel] = useState(0);
    const [luck, setLuck] = useState(0);
    const [moral, setMoral] = useState(100);
    const [nightBonus, setNightBonus] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = () => {
        setLoading(true);
        axios.post(route('simulator.simulate'), {
            attacker_units: attackerUnits,
            defender_units: defenderUnits,
            wall_level: wallLevel,
            luck: luck,
            moral: moral,
            night_bonus: nightBonus
        })
        .then(response => {
            setResult(response.data);
            setLoading(false);
            toast.success('Simulação concluída!');
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
            toast.error('Erro na simulação.');
        });
    };

    return (
        <AppLayout>
            <Head title="Simulador de Combate" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-primary" />
                        Simulador Tático de Combate
                    </h1>
                    <p className="text-gray-400 mt-1">Preveja desfechos de batalhas e minimize perdas estratégicas.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Attacker Panel */}
                            <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Sword className="w-5 h-5 text-rose-500" />
                                    Forças Atacantes
                                </h3>
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {unitTypes.map(unit => (
                                        <div key={unit.id} className="flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-sm font-medium text-gray-300">{unit.display_name || unit.name}</span>
                                            <input 
                                                type="number"
                                                min="0"
                                                className="w-24 bg-black/40 border-white/10 rounded-lg px-3 py-1.5 text-white text-right focus:border-rose-500 transition-all"
                                                placeholder="0"
                                                value={attackerUnits[unit.id] || ''}
                                                onChange={e => setAttackerUnits({ ...attackerUnits, [unit.id]: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Defender Panel */}
                            <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    Forças Defensoras
                                </h3>
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {unitTypes.map(unit => (
                                        <div key={unit.id} className="flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-sm font-medium text-gray-300">{unit.display_name || unit.name}</span>
                                            <input 
                                                type="number"
                                                min="0"
                                                className="w-24 bg-black/40 border-white/10 rounded-lg px-3 py-1.5 text-white text-right focus:border-blue-500 transition-all"
                                                placeholder="0"
                                                value={defenderUnits[unit.id] || ''}
                                                onChange={e => setDefenderUnits({ ...defenderUnits, [unit.id]: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modifiers Section */}
                        <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">Variáveis de Ambiente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Muralha (Nível)</label>
                                    <input 
                                        type="number" min="0" max="20"
                                        className="w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white"
                                        value={wallLevel}
                                        onChange={e => setWallLevel(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Sorte (-25 a 25%)</label>
                                    <input 
                                        type="number" min="-25" max="25"
                                        className="w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white"
                                        value={luck}
                                        onChange={e => setLuck(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Moral (30 a 100%)</label>
                                    <input 
                                        type="number" min="30" max="100"
                                        className="w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white"
                                        value={moral}
                                        onChange={e => setMoral(parseInt(e.target.value) || 100)}
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button 
                                        onClick={() => setNightBonus(!nightBonus)}
                                        className={`w-full py-2 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold ${
                                            nightBonus 
                                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                                            : 'bg-white/5 border-white/10 text-gray-400'
                                        }`}
                                    >
                                        {nightBonus ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                        Bónus Noturno
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSimulate}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 text-xl group"
                        >
                            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />}
                            EXECUTAR SIMULAÇÃO
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-1 space-y-6">
                        {result ? (
                            <div className="space-y-6">
                                {/* Result Card */}
                                <div className={`border rounded-2xl p-6 backdrop-blur-md shadow-2xl ${
                                    result.attacker_won ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                                }`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white">VENCEDOR</h2>
                                        {result.attacker_won ? (
                                            <Trophy className="w-10 h-10 text-green-500 animate-bounce" />
                                        ) : (
                                            <Shield className="w-10 h-10 text-red-500" />
                                        )}
                                    </div>
                                    <div className={`text-4xl font-black mb-4 uppercase tracking-tighter ${
                                        result.attacker_won ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {result.attacker_won ? 'Atacante' : 'Defensor'}
                                    </div>
                                    <p className="text-gray-400 text-sm">A batalha foi resolvida com {Math.round(result.stats.luck * 100)}% de sorte e {result.stats.moral}% de moral.</p>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                            Análise de Perdas
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {/* Attacker Losses */}
                                        <div>
                                            <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">Baixas do Atacante</div>
                                            <div className="space-y-2">
                                                {result.attacker_units.map((u: any) => u.losses > 0 && (
                                                    <div key={u.id} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">{u.name}</span>
                                                        <span className="text-rose-400 font-bold">-{u.losses}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-px bg-white/5" />
                                        {/* Defender Losses */}
                                        <div>
                                            <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Baixas do Defensor</div>
                                            <div className="space-y-2">
                                                {result.defender_units.map((u: any) => u.losses > 0 && (
                                                    <div key={u.id} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">{u.name}</span>
                                                        <span className="text-blue-400 font-bold">-{u.losses}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/50 border border-dashed border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                                <AlertCircle className="w-16 h-16 text-gray-700 mb-4" />
                                <div className="text-gray-500 font-bold text-lg">Aguardando dados...</div>
                                <p className="text-gray-600 text-sm mt-2">Configure as tropas e clique em executar para ver os resultados táticos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}} />
        </AppLayout>
    );
}
