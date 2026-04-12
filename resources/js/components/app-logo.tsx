import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 px-1 py-1">
            <div className="text-sky-500 flex aspect-square size-9 items-center justify-center transition-all duration-300">
                <AppLogoIcon className="size-7 fill-current drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-sm font-black truncate leading-none uppercase tracking-tighter text-white">Guerras</span>
                <span className="text-[10px] truncate font-bold uppercase tracking-[0.2em] text-sky-500/80">Modernas</span>
            </div>
        </div>
    );
}
