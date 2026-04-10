import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const rootElement = document.getElementById('app');

if (rootElement) {
    // Only initialize theme and Inertia if we are in an Inertia-enabled page
    initializeTheme();
    console.log("--- GUERRAS MODERNAS SINAL V3.9.2 ATIVO ---");
    
    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => {
            if (!name) {
                console.error("ERRO_TECNICO: Componente Inertia indefinido detetado. A restaurar sinal...");
                return resolvePageComponent(`./pages/dashboard.tsx`, import.meta.glob('./pages/**/*.tsx'));
            }
            return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        },
        setup({ el, App, props }) {
            const root = createRoot(el);
            root.render(<App {...props} />);
        },
        progress: {
            color: '#0ea5e9',
        },
    });
}
