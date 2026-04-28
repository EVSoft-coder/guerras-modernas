import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    ShieldAlert, 
    Hammer, 
    Users, 
    Tags, 
    Plus, 
    Trash2, 
    Save, 
    Play, 
    ChevronRight,
    Search,
    TrendingUp,
    Activity,
    Target as TargetIcon,
    Sword
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, 
    AreaChart, Area, BarChart, Bar, Legend 
} from 'recharts';
import { toast } from 'sonner';

interface BaseData {
    id: number;
    nome: string;
    coordenadas: string;
    resources: any;
    buildings: any[];
    units: any[];
    groups: number[];
    queues: {
        buildings: number;
        units: number;
    };
    movements: {
        outgoing: number;
        incoming: number;
    };
}

interface UnitType {
    id: number;
    name: string;
    code: string;
}

interface Group {
    id: number;
    name: string;
    color: string;
}

interface Template {
    id: number;
    name: string;
    steps: any[];
}

export default function CommandCenter(props: {
    bases: BaseData[];
    unitTypes: UnitType[];
    groups: Group[];
    templates: Template[];
    playerHistory: any[];
    allianceHistory: any[];
}) {
    const [activeTab, setActiveTab] = useState<'overview' | 'recruit' | 'templates' | 'groups' | 'intel'>('overview');
    const [filterGroup, setFilterGroup] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBases = props.bases.filter(base => {
        const matchesGroup = filterGroup === null || base.groups.includes(filterGroup);
        const matchesSearch = base.nome.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGroup && matchesSearch;
    });

    // Forms
    const recruitForm = useForm<{ orders: Record<number, Record<number, number>> }>({
        orders: {}
    });

    const templateForm = useForm<{ template_id: number | null; base_ids: number[] }>({
        template_id: null,
        base_ids: []
    });

    const groupForm = useForm({
        name: '',
        color: '#3b82f6'
    });

    const handleRecruitChange = (baseId: number, unitTypeId: number, quantity: string) => {
        const qty = parseInt(quantity) || 0;
        recruitForm.setData('orders', {
            ...recruitForm.data.orders,
            [baseId]: {
                ...(recruitForm.data.orders[baseId] || {}),
                [unitTypeId]: qty
            }
        });
    };

    const submitRecruit = () => {
        recruitForm.post(route('command.recruit'), {
            onSuccess: () => toast.success('Ordens de recrutamento enviadas!'),
            onError: () => toast.error('Erro ao processar recrutamento em massa.')
        });
    };

    const submitGroup = (e: React.FormEvent) => {
        e.preventDefault();
        groupForm.post(route('command.groups.store'), {
            onSuccess: () => {
                toast.success('Grupo criado!');
                groupForm.reset();
            }
        });
    };

    const [newTemplate, setNewTemplate] = useState<{name: string, steps: {building_type: string, target_level: number}[]}>({
        name: '',
        steps: []
    });

    const addTemplateStep = () => {
        setNewTemplate({
            ...newTemplate,
            steps: [...newTemplate.steps, { building_type: 'mina', target_level: 1 }]
        });
    };

    const submitTemplate = () => {
        router.post(route('command.templates.store'), newTemplate as any, {
            onSuccess: () => {
                toast.success('Template criado!');
                setNewTemplate({ name: '', steps: [] });
            }
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alto Comando', href: '/command-center' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alto Comando - Gestão de Massa" />
            
            <div className="tactical-crt-overlay" />

            <div className="p-6 max-w-[1600px] mx-auto space-y-6 relative z-10">
                {/* Header Tático */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/60 border border-white/10 p-6 backdrop-blur-md rounded-xl">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter text-white flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-blue-500" />
                            ALTO COMANDO
                            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 uppercase">
                                Nível de Acesso: General
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1 font-mono uppercase tracking-widest">
                            Sincronização de recursos e unidades em tempo real
                        </p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        <TabButton 
                            active={activeTab === 'overview'} 
                            onClick={() => setActiveTab('overview')}
                            icon={<LayoutDashboard className="w-4 h-4" />}
                            label="Geral"
                        />
                        <TabButton 
                            active={activeTab === 'recruit'} 
                            onClick={() => setActiveTab('recruit')}
                            icon={<Users className="w-4 h-4" />}
                            label="Recrutar"
                        />
                        <TabButton 
                            active={activeTab === 'templates'} 
                            onClick={() => setActiveTab('templates')}
                            icon={<Hammer className="w-4 h-4" />}
                            label="Templates"
                        />
                        <TabButton 
                            active={activeTab === 'groups'} 
                            onClick={() => setActiveTab('groups')}
                            icon={<Tags className="w-4 h-4" />}
                            label="Grupos"
                        />
                        <TabButton 
                            active={activeTab === 'intel' as any} 
                            onClick={() => setActiveTab('intel' as any)}
                            icon={<Search className="w-4 h-4" />}
                            label="Intel"
                        />
                    </div>
                </div>

                {/* Filtros e Ferramentas */}
                <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Procurar base..." 
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button 
                            onClick={() => setFilterGroup(null)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filterGroup === null ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                        >
                            Todas
                        </button>
                        {props.groups.map(group => (
                            <button 
                                key={group.id}
                                onClick={() => setFilterGroup(group.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-2 ${filterGroup === group.id ? 'text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                                style={{ 
                                    backgroundColor: filterGroup === group.id ? group.color : 'transparent',
                                    borderColor: filterGroup === group.id ? 'white' : 'rgba(255,255,255,0.1)' 
                                }}
                            >
                                <span className="w-2 h-2 rounded-full bg-white/50" />
                                {group.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conteúdo Principal */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm"
                    >
                        {activeTab === 'overview' && (
                            <OverviewTable bases={filteredBases} />
                        )}

                        {activeTab === 'recruit' && (
                            <RecruitGrid 
                                bases={filteredBases} 
                                unitTypes={props.unitTypes} 
                                form={recruitForm}
                                onChange={handleRecruitChange}
                                onSubmit={submitRecruit}
                            />
                        )}

                        {activeTab === 'templates' && (
                            <TemplatesPanel 
                                bases={filteredBases}
                                templates={props.templates}
                            />
                        )}

                        {activeTab === 'groups' && (
                            <GroupsPanel 
                                bases={props.bases}
                                groups={props.groups}
                            />
                        )}

                        {activeTab === 'intel' && (
                            <IntelPanel 
                                playerHistory={props.playerHistory}
                                allianceHistory={props.allianceHistory}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <style>{`
                .tactical-crt-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none;
                    z-index: 50;
                    opacity: 0.1;
                }
            `}</style>
        </AppLayout>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
            {icon}
            {label}
        </button>
    );
}

function OverviewTable({ bases }: { bases: BaseData[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                        <th className="px-6 py-4">Base</th>
                        <th className="px-6 py-4">Recursos</th>
                        <th className="px-6 py-4">Capacidade</th>
                        <th className="px-6 py-4">Unidades</th>
                        <th className="px-6 py-4">Movimentos</th>
                        <th className="px-6 py-4">Filas</th>
                        <th className="px-6 py-4">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {bases.map(base => (
                        <tr key={base.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">{base.nome}</span>
                                    <span className="text-[10px] font-mono text-gray-500">{base.coordenadas}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <ResourceMini type="suprimentos" value={base.resources.suprimentos} />
                                    <ResourceMini type="combustivel" value={base.resources.combustivel} />
                                    <ResourceMini type="municoes" value={base.resources.municoes} />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 w-24">
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span className="text-gray-500">POP</span>
                                        <span className="text-blue-400">{Math.floor(base.resources.pessoal || 0)}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '60%' }} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-white font-mono">{base.units.reduce((acc, u) => acc + u.quantity, 0)}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {base.movements.outgoing > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20" title="Ataques em curso">
                                            <Sword size={10} /> {base.movements.outgoing}
                                        </div>
                                    )}
                                    {base.movements.incoming > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse" title="Ataques a chegar">
                                            <ShieldAlert size={10} /> {base.movements.incoming}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {base.queues.buildings > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Construção Ativa" />
                                    )}
                                    {base.queues.units > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Recrutamento Ativo" />
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <button className="p-2 bg-white/5 rounded hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ResourceMini({ type, value }: { type: string; value: number }) {
    const colors: Record<string, string> = {
        suprimentos: 'text-green-400',
        combustivel: 'text-orange-400',
        municoes: 'text-red-400'
    };
    return (
        <div className="flex flex-col">
            <span className={`text-xs font-mono font-bold ${colors[type]}`}>{Math.floor(value).toLocaleString()}</span>
            <span className="text-[8px] uppercase text-gray-500">{type.substring(0, 3)}</span>
        </div>
    );
}

function RecruitGrid({ bases, unitTypes, form, onChange, onSubmit }: any) {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    MOBILIZAÇÃO EM MASSA
                </h3>
                <button 
                    onClick={onSubmit}
                    disabled={form.processing}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <Play className="w-4 h-4" />
                    EXECUTAR ORDENS
                </button>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-[10px] uppercase font-mono text-gray-400">
                            <th className="px-4 py-3 min-w-[200px]">Base</th>
                            {unitTypes.map((type: any) => (
                                <th key={type.id} className="px-4 py-3 text-center">{type.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bases.map((base: any) => (
                            <tr key={base.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-bold">{base.nome}</span>
                                        <span className="text-[9px] text-gray-500 font-mono">POP: {Math.floor(base.resources.pessoal)}</span>
                                    </div>
                                </td>
                                {unitTypes.map((type: any) => (
                                    <td key={type.id} className="px-4 py-3">
                                        <input 
                                            type="number"
                                            min="0"
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-center text-sm text-white focus:ring-1 focus:ring-green-500/50"
                                            placeholder="0"
                                            onChange={(e) => onChange(base.id, type.id, e.target.value)}
                                            value={form.data.orders[base.id]?.[type.id] || ''}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TemplatesPanel({ bases, templates }: { bases: BaseData[]; templates: Template[] }) {
    return (
        <div className="p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Hammer className="w-5 h-5 text-orange-500" />
                        TEMPLATES
                    </h3>
                    <button className="p-2 bg-white/5 rounded hover:bg-white/10 text-white">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-2">
                    {templates.map(template => (
                        <div key={template.id} className="bg-white/5 border border-white/5 p-4 rounded-lg hover:border-orange-500/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <span className="text-white font-bold">{template.name}</span>
                                <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400 transition-colors" />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 font-mono uppercase tracking-widest">
                                {template.steps.length} Passos de Construção
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-xl p-6">
                <div className="text-center py-12 text-gray-500">
                    <Play className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Seleciona um template para aplicar às tuas bases em massa.</p>
                </div>
            </div>
        </div>
    );
}

function GroupsPanel({ bases, groups }: { bases: BaseData[]; groups: Group[] }) {
    return (
        <div className="p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Tags className="w-5 h-5 text-blue-500" />
                        GRUPOS TÁTICOS
                    </h3>
                    <button className="p-2 bg-white/5 rounded hover:bg-white/10 text-white">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-2">
                    {groups.map(group => (
                        <div key={group.id} className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-lg group">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                                <span className="text-white font-bold">{group.name}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-500 hover:text-white"><Save className="w-4 h-4" /></button>
                                <button className="text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {bases.map(base => (
                        <div key={base.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold text-sm">{base.nome}</span>
                                <span className="text-[10px] font-mono text-gray-500">{base.coordenadas}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {base.groups.map(groupId => {
                                    const g = groups.find(x => x.id === groupId);
                                    return g ? (
                                        <span key={g.id} className="text-[8px] px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: g.color }}>
                                            {g.name}
                                        </span>
                                    ) : null;
                                })}
                                <button className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                                    <Plus className="w-3 h-3 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function IntelPanel({ playerHistory, allianceHistory }: { playerHistory: any[], allianceHistory: any[] }) {
    const hasData = playerHistory.length > 0;
    
    const chartData = hasData ? playerHistory.map(d => ({
        ...d,
        date: new Date(d.recorded_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
    })) : [
        { date: '20 Abr', pontos: 1200, total_units: 500, attack_power: 300, defense_power: 400 },
        { date: '21 Abr', pontos: 1500, total_units: 600, attack_power: 450, defense_power: 550 },
        { date: '22 Abr', pontos: 1800, total_units: 750, attack_power: 600, defense_power: 700 },
        { date: '23 Abr', pontos: 2200, total_units: 900, attack_power: 850, defense_power: 950 },
        { date: '24 Abr', pontos: 2800, total_units: 1100, attack_power: 1200, defense_power: 1300 },
        { date: '25 Abr', pontos: 3500, total_units: 1400, attack_power: 1600, defense_power: 1700 },
        { date: '26 Abr', pontos: 4200, total_units: 1800, attack_power: 2100, defense_power: 2200 },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-cyan-400" />
                    INTELIGÊNCIA ESTRATÉGICA
                </h3>
                {!hasData && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20 font-bold uppercase tracking-widest">
                        Modo Simulação: Aguardando Primeiro Snapshot
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-500" />
                        Evolução de Pontos
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <ChartTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                <Area type="monotone" dataKey="pontos" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPoints)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h4 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <TargetIcon className="w-4 h-4 text-rose-500" />
                        Efetivos Mobilizados
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <ChartTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                <Bar dataKey="total_units" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
