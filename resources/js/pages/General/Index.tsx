import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Shield, Sword, Truck, Target, Zap, Trophy, Edit2, Check, Star, Award } from 'lucide-react';
import { useToasts } from '@/components/game/ToastProvider';

interface GeneralProps {
    general: any;
    skillsDisponiveis: any;
    xpNextLevel: number;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Alto Comando: O General', href: '/general' },
];

export default function Index({ general, skillsDisponiveis, xpNextLevel }: GeneralProps) {
    const { addToast } = useToasts();
    
    if (!general) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Alto Comando - O General" />
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="p-8 bg-zinc-900 border border-white/10 rounded-full shadow-2xl">
                        <Award className="text-white/10" size={80} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Nenhum General Ativo</h1>
                        <p className="text-neutral-500 max-w-md mx-auto leading-relaxed">
                            O Alto Comando ainda não designou um oficial superior para liderar as tuas tropas. 
                            Continua a expandir a tua influência para recrutar o teu primeiro líder.
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(general.nome);

    const handleRename = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/general/rename', { nome: newName }, {
            onSuccess: () => {
                setIsEditingName(false);
                addToast('Codinome atualizado, Comandante.', 'success');
            }
        });
    };

    const handleUpgrade = (skillSlug: string) => {
        router.post('/general/upgrade', { skill: skillSlug }, {
            onSuccess: () => addToast('Especialização militar aprimorada.', 'success'),
            onError: (err) => addToast(Object.values(err)[0] as string, 'error')
        });
    };

    const getSkillLevel = (slug: string) => {
        return general.skills?.find((s: any) => s.skill_slug === slug)?.nivel || 0;
    };

    const xpProgress = (general.experiencia / xpNextLevel) * 100;

    const skillIcons: Record<string, any> = {
        logistica: <Truck className="text-blue-400" size={20} />,
        ofensiva: <Sword className="text-red-400" size={20} />,
        defensiva: <Shield className="text-emerald-400" size={20} />,
        saque: <Target className="text-amber-400" size={20} />,
        recrutamento: <Zap className="text-purple-400" size={20} />,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alto Comando - O General" />

            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Header: Perfil do General */}
                <div className="relative overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] -mr-32 -mt-32" />
                    
                    {/* Avatar/Medalha */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-full bg-black border-4 border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <Award className="text-white/20 group-hover:text-white/40 transition-colors" size={64} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-sky-600 text-white font-black text-sm px-3 py-1 rounded-full border-2 border-zinc-900 shadow-lg">
                            NÍVEL {general.nivel}
                        </div>
                    </div>

                    {/* Info Central */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            {isEditingName ? (
                                <form onSubmit={handleRename} className="flex items-center gap-2">
                                    <input 
                                        autoFocus
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        className="bg-black border border-sky-500/50 rounded px-3 py-1 text-2xl font-black text-white outline-none"
                                    />
                                    <button type="submit" className="p-2 bg-sky-600 rounded text-white"><Check size={20}/></button>
                                </form>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                                        {general.nome}
                                    </h1>
                                    <button onClick={() => setIsEditingName(true)} className="text-neutral-500 hover:text-white transition">
                                        <Edit2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-2">
                                <Trophy className="text-amber-500" size={16} />
                                <span className="text-xs font-bold text-neutral-400 uppercase">Pontos de Comando: <span className="text-white">{general.pontos_skill}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-sky-500" size={16} />
                                <span className="text-xs font-bold text-neutral-400 uppercase">Experiência Total: <span className="text-white">{general.experiencia}</span></span>
                            </div>
                        </div>

                        {/* XP Bar */}
                        <div className="w-full max-w-md space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                <span>Progresso para Nível {general.nivel + 1}</span>
                                <span>{general.experiencia} / {xpNextLevel} XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-1000"
                                    style={{ width: `${xpProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(skillsDisponiveis).map(([slug, skill]: [string, any]) => {
                        const level = getSkillLevel(slug);
                        const isMax = level >= skill.max_nivel;
                        
                        return (
                            <div key={slug} className={`bg-zinc-900 border rounded-2xl p-6 transition-all duration-500 flex flex-col ${level > 0 ? 'border-white/10' : 'border-white/5 opacity-80'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-black rounded-xl border border-white/5 shadow-inner">
                                        {skillIcons[slug]}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Especialização</div>
                                        <div className="text-sm font-black text-white">{level} / {skill.max_nivel}</div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">{skill.nome}</h3>
                                <p className="text-xs text-neutral-400 leading-relaxed mb-6 h-8">{skill.descricao}</p>

                                <div className="mt-auto space-y-4">
                                    {/* Bonus Display */}
                                    <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded-lg px-3 py-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                        <span className="text-[10px] font-bold text-neutral-300">Bónus Atual: <span className="text-sky-400">+{level * skill.bonus}%</span></span>
                                    </div>

                                    <button 
                                        disabled={isMax || general.pontos_skill <= 0}
                                        onClick={() => handleUpgrade(slug)}
                                        className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                            isMax 
                                            ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                                            : general.pontos_skill > 0
                                            ? 'bg-white text-black hover:bg-sky-400 shadow-xl'
                                            : 'bg-white/5 text-neutral-600 cursor-not-allowed'
                                        }`}
                                    >
                                        {isMax ? 'Mestria Alcançada' : 'Aprimorar'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Tático */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-6 text-center">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                        As competências do General são aplicadas a todas as operações militares da conta.
                    </p>
                </div>

            </div>
        </AppLayout>
    );
}
