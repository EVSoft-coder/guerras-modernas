import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Base } from '@/types';
import { Map, MapPin } from 'lucide-react';

interface WorldMapProps {
    bases: Base[];
    currentBase?: Base;
}

/**
 * WorldMap (Placeholder - FASE 7)
 * Visualização tática das coordenadas globais.
 */
export function WorldMap({ bases, currentBase }: WorldMapProps) {
    return (
        <Card className="bg-black/80 border-cyan-500/30 backdrop-blur-md">
            <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-cyan-400 font-mono flex items-center gap-2">
                    <Map size={20} />
                    SITREP: MAPEAMENTO GLOBAL (SETOR 0-1000)
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-mono">
                        <thead className="text-cyan-600 uppercase text-xs">
                            <tr>
                                <th className="pb-4">Base Detetada</th>
                                <th className="pb-4">Coordenadas</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-cyan-100/80 divide-y divide-cyan-500/10">
                            {bases.map((base) => (
                                <tr key={base.id} className={base.id === currentBase?.id ? 'bg-cyan-500/10' : ''}>
                                    <td className="py-3 flex items-center gap-2">
                                        <MapPin size={14} className={base.id === currentBase?.id ? 'text-amber-500' : 'text-cyan-500'} />
                                        {base.nome} 
                                        {base.id === currentBase?.id && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 rounded ml-2">ORIGEM</span>}
                                    </td>
                                    <td className="py-3">
                                        <span className="text-cyan-400">X:</span> {base.coordenada_x ?? base.x} 
                                        <span className="ml-3 text-cyan-400">Y:</span> {base.coordenada_y ?? base.y}
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            ATV
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-6 p-4 border border-dashed border-cyan-500/20 rounded-lg bg-cyan-500/5">
                    <p className="text-[11px] text-cyan-500/60 leading-relaxed uppercase">
                        Sinal de Satélite estável. O sistema de coordenadas único garante que nenhuma base ocupe o mesmo setor tático. 
                        Alcance de operação atual: 1000x1000 unidades.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
