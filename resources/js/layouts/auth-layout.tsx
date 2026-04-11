import { useEffect } from 'react';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    useEffect(() => {
        // Purge game layers on auth pages
        const layers = ['GAME_SCREEN', 'MAIN_MENU', 'PAUSE_SCREEN', 'village-view-container', 'tactical-hud', 'world-map-view'];
        layers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = 'none';
                el.style.pointerEvents = 'none';
            }
        });
    }, []);

    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
