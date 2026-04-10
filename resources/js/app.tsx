import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@/components/game/ToastProvider';
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
            const pages = import.meta.glob('./pages/**/*.tsx');
            const path = `./pages/${name}.tsx`;
            
            if (!name || name === 'undefined') {
                // Silenciamos o aviso se for um estado de carga inicial vazio
                if (name === 'undefined') {
                    console.warn(`[REDE_DE_SEGURANCA] Intercepção de rota 'undefined'. Redirecionando para Dashboard.`);
                }
                return resolvePageComponent(`./pages/dashboard.tsx`, pages);
            }

            if (!pages[path]) {
                console.error(`[INTERCEPTOR] Componente não encontrado: ${path}. Ativando protocolo de contingência.`);
                return resolvePageComponent(`./pages/dashboard.tsx`, pages);
            }

            return resolvePageComponent(path, pages);
        },
        setup({ el, App, props }) {
            const root = createRoot(el);
            root.render(
            <ToastProvider>
                <App {...props} />
            </ToastProvider>
        );
        },
        progress: {
            color: '#0ea5e9',
        },
    });
}
