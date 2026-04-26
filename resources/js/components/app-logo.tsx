import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 px-1 py-1">
            <div className="text-sky-500 flex aspect-square size-10 items-center justify-center transition-all duration-300">
                <AppLogoIcon className="size-8 fill-current drop-shadow-[0_0_12px_rgba(14,165,233,0.6)]" />
            </div>
            <div className="flex flex-col justify-center border-l border-white/10 pl-3">
                <span className="text-[15px] font-black truncate leading-none uppercase tracking-tighter text-white">GUERRAS</span>
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                    <span className="text-[9px] truncate font-black uppercase tracking-[0.35em] text-sky-500">MODERNAS</span>
                </div>
            </div>
        </div>
    );
}
