import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Crosshair, 
    Sword, 
    Shield, 
    MapPin, 
    History, 
    Zap, 
    Save,
    Search,
    AlertTriangle,
    CheckCircle2,
    Info,
    Package,
    Navigation2
} from 'lucide-react';

interface UnitType {
    id: number;
    name: string;
    display_name: string;
    cost_pessoal: number;
}

interface FarmingTemplate {
    id: number;
    nome: string;
    unidades: Record<number, number>;
}

interface Target {
    id: number;
    nome: string;
    x: number;
    y: number;
    distancia: number;
    last_report: {
        id: number;
        vitoria: boolean;
        created_at: string;
        resources: {
            suprimentos: number;
            combustivel: number;
            municoes: number;
            metal: number;
            energia: number;
        } | null;
    } | null;
}

interface Props {
    templates: FarmingTemplate[];
    targets: Target[];
    unitTypes: UnitType[];
    currentBaseId: number;
}

export default function Farming({ templates, targets, unitTypes, currentBaseId }: Props) {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(templates[0]?.id || null);
    const [sending, setSending] = useState<Record<number, boolean>>({});

    const { data, setData, post, processing, reset } = useForm({
        nome: '',
        unidades: {} as Record<number, number>
    });

    const handleSaveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('premium.farming.templates.store'), {
            onSuccess: () => reset()
        });
    };

    const handleQuickAttack = (targetId: number) => {
        if (!selectedTemplate) return;

        setSending(prev => ({ ...prev, [targetId]: true }));
        
        axios.post(route('premium.farming.attack'), {
            target_id: targetId,
            template_id: selectedTemplate,
            origin_id: currentBaseId
        })
        .then(response => {
            // Success feedback
            setSending(prev => ({ ...prev, [targetId]: false }));
            // Optionally remove from list or show success icon
        })
        .catch(error => {
            console.error(error);
            setSending(prev => ({ ...prev, [targetId]: false }));
            alert(error.response?.data?.message || 'Erro ao enviar tropas');
        });
    };

    return (
        <AppLayout>
            <Head title="Assistente de Farming" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Crosshair className="w-8 h-8 text-primary" />
                            Assistente de Farming
                        </h1>
                        <p className="text-gray-400 mt-1">Automatize saques a aldeias bárbaras e rebeldes próximos.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-900/50 p-2 rounded-xl border border-white/10">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-300">Funcionalidade Premium Ativa</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Templates */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Sword className="w-5 h-5 text-primary" />
                                Modelos de Tropas
                            </h2>
                            
                            <div className="space-y-3">
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                                            selectedTemplate === template.id 
                                            ? 'bg-primary/20 border-primary text-white' 
                                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="font-bold">{template.nome}</div>
                                        <div className="text-xs opacity-60">
                                            {Object.entries(template.unidades).map(([id, qty]) => {
                                                const unit = unitTypes.find(u => u.id === parseInt(id));
                                                return qty > 0 ? `${qty}x ${unit?.display_name}, ` : null;
                                            })}
                                        </div>
                                    </button>
                                ))}
                                {templates.length === 0 && (
                                    <p className="text-sm text-gray-500 italic text-center py-4">Nenhum modelo criado.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                            <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Novo Modelo</h3>
                            <form onSubmit={handleSaveTemplate} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nome do Modelo"
                                    value={data.nome}
                                    onChange={e => setData('nome', e.target.value)}
                                    className="w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-all"
                                    required
                                />
                                
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {unitTypes.map(unit => (
                                        <div key={unit.id} className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-gray-400">{unit.display_name}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-20 bg-black/40 border-white/10 rounded-lg px-2 py-1 text-white text-right"
                                                value={data.unidades[unit.id] || 0}
                                                onChange={e => setData('unidades', { ...data.unidades, [unit.id]: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Guardar Modelo
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Main Content: Targets Table */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <Navigation2 className="w-6 h-6 text-primary rotate-45" />
                                    Alvos Próximos
                                </h2>
                                <div className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    Mostrando {targets.length} bases bárbaras num raio de 50km
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Aldeia / Coords</th>
                                            <th className="px-6 py-4">Distância</th>
                                            <th className="px-6 py-4">Último Relatório</th>
                                            <th className="px-6 py-4 text-center">Recursos Vistos</th>
                                            <th className="px-6 py-4 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {targets.map(target => (
                                            <tr key={target.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-white group-hover:text-primary transition-colors">
                                                        {target.nome}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {target.x}|{target.y}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-300">{target.distancia} km</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {target.last_report ? (
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                {target.last_report.vitoria ? (
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                                                )}
                                                                <span className="text-sm text-gray-300">
                                                                    {new Date(target.last_report.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <a 
                                                                href={route('relatorio.show', target.last_report.id)}
                                                                className="text-xs text-primary hover:underline"
                                                            >
                                                                Ver Relatório
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-600 italic">Sem histórico</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {target.last_report?.resources ? (
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                                <span className="text-gray-400">SUP:</span>
                                                                <span className="text-gray-200">{target.last_report.resources.suprimentos}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                <span className="text-gray-400">COM:</span>
                                                                <span className="text-gray-200">{target.last_report.resources.combustivel}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                                <span className="text-gray-400">MUN:</span>
                                                                <span className="text-gray-200">{target.last_report.resources.municoes}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                                <span className="text-gray-400">MET:</span>
                                                                <span className="text-gray-200">{target.last_report.resources.metal}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <History className="w-5 h-5 text-white/10" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleQuickAttack(target.id)}
                                                        disabled={!selectedTemplate || sending[target.id]}
                                                        className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ml-auto ${
                                                            !selectedTemplate 
                                                            ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                                                            : 'bg-primary hover:bg-primary-hover text-black shadow-lg shadow-primary/20'
                                                        }`}
                                                    >
                                                        {sending[target.id] ? (
                                                            <Zap className="w-4 h-4 animate-pulse" />
                                                        ) : (
                                                            <Sword className="w-4 h-4" />
                                                        )}
                                                        Ataque Rápido
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {targets.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                                    <div className="text-gray-400 font-bold">Nenhuma aldeia bárbara encontrada neste setor.</div>
                                                    <div className="text-gray-600 text-sm">Tente mudar de base ou expandir o seu território.</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--primary-rgb), 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--primary-rgb), 0.4);
                }
            `}} />
        </AppLayout>
    );
}
