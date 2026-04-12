import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 px-1 py-2">
            <div className="bg-sky-500/10 text-sky-500 flex aspect-square size-10 items-center justify-center rounded-lg border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                <AppLogoIcon className="size-6 fill-current" />
            </div>
            <div className="ml-1 flex flex-col justify-center">
                <span className="text-sm font-black truncate leading-none uppercase tracking-tighter text-white">Guerras</span>
                <span className="text-[10px] truncate font-bold uppercase tracking-[0.2em] text-sky-500/80">Modernas</span>
            </div>
        </div>
    );
}
