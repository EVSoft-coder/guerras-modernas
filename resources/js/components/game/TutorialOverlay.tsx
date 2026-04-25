import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Zap, Globe, X } from 'lucide-react';

export function TutorialOverlay() {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('mw_tutorial_seen');
        if (!hasSeenTutorial) {
            setIsVisible(true);
        }
    }, []);

    const steps = [
        {
            title: "Bem-vindo ao Comando",
            content: "Comandante, você foi designado para este setor estratégico. Aqui está o seu painel tático principal.",
            icon: <Target className="text-orange-500" size={40} />
        },
        {
            title: "Gestão de Recursos",
            content: "Observe a barra superior. Suprimentos, Combustível e Munições são vitais para as suas operações.",
            icon: <Zap className="text-orange-500" size={40} />
        },
        {
            title: "Mobilização",
            content: "Clique nos edifícios para expandir a sua base ou treinar tropas. A velocidade depende do seu nível tecnológico.",
            icon: <Shield className="text-orange-500" size={40} />
        },
        {
            title: "Operação Global",
            content: "Use o mapa para localizar alvos. Lembre-se: o território é hostil. Boa sorte, Comandante.",
            icon: <Globe className="text-orange-500" size={40} />
        }
    ];

    const handleClose = () => {
        localStorage.setItem('mw_tutorial_seen', 'true');
        setIsVisible(false);
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#0b0f14] border border-orange-500/30 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_100px_rgba(249,115,22,0.2)] relative overflow-hidden"
                    >
                        {/* DECORATIVE */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[80px] rounded-full" />
                        
                        <button 
                            onClick={handleClose}
                            className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center gap-6 relative z-10">
                            <motion.div 
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20"
                            >
                                {steps[step].icon}
                            </motion.div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                                    {steps[step].title}
                                </h3>
                                <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                                    {steps[step].content}
                                </p>
                            </div>

                            <div className="flex gap-2 mb-4">
                                {steps.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-orange-500' : 'w-2 bg-neutral-800'}`} 
                                    />
                                ))}
                            </div>

                            <button 
                                onClick={nextStep}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                            >
                                {step < steps.length - 1 ? "Próximo Passo" : "Entendido, Comandante"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
