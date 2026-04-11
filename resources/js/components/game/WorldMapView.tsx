import React from 'react';
import { Map as MapIcon, Target } from 'lucide-react';

export function WorldMapView() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-neutral-900 text-white min-h-[500px] border-2 border-dashed border-sky-500/20 rounded-3xl p-10">
            <div className="text-center animate-pulse">
                <MapIcon className="mx-auto text-sky-500 mb-6" size={80} />
                <h2 className="text-4xl font-black uppercase tracking-[0.2em]">World Map Overlay</h2>
                <p className="text-neutral-500 mt-4 font-mono">TACTICAL_GRID_INITIALIZING... [STATUS: STANDBY]</p>
            </div>
            
            <div className="mt-12 grid grid-cols-10 gap-2 opacity-20">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-8 h-8 border border-sky-500/30 rounded-sm"></div>
                ))}
            </div>
        </div>
    );
}
