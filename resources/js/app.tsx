import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@/components/game/ToastProvider';
import { initializeTheme } from './hooks/use-appearance';
declare global {
    interface Window {
        route: any;
    }
}


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const rootElement = document.getElementById('app');

if (rootElement) {
    initializeTheme();
    console.log("--- GUERRAS MODERNAS SINAL V3.9.2 ATIVO ---");
    
    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx');
            const path = `./pages/${name}.tsx`;
            
            if (!name || name === 'undefined') {
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
            console.log("UI MOUNTED");

            // MOTOR ECS: Só carrega se estiver autenticado no Dashboard
            const isAuth = (props?.initialPage?.props as any)?.auth?.user;
            const isDashboard = props?.initialPage?.component?.toLowerCase()?.includes('dashboard');

            if (isAuth && isDashboard) {
                console.log("[MOTOR] Autorização detectada. Ativando ECS Engine...");
                import('../../src/index');
            } else {
                // Segurança: Garantir que overlays legados ou injetados por engano não bloqueiam a UI fora do dashboard
                const blockingElements = ['GAME_SCREEN', 'MAIN_MENU', 'PAUSE_SCREEN', 'village-view-container', 'tactical-hud', 'world-map-view'];
                blockingElements.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.display = 'none';
                        el.style.pointerEvents = 'none';
                        el.style.visibility = 'hidden';
                        el.style.zIndex = '-1'; // Enviar para trás de tudo
                    }
                });
            }
            
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

