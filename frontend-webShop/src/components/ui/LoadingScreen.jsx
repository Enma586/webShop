export const LoadingScreen = () => {
    return (
        <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-6 antialiased">
            {/* Logo con efecto Glow */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <h1 className="relative text-4xl font-black italic tracking-tighter text-foreground uppercase">
                    PIBEs <span className="text-primary not-italic">SHOP</span>
                </h1>
            </div>

            {/* Barra de progreso técnica */}
            <div className="w-48 h-2px bg-secondary relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-primary animate-progress-slide w-1/3" />
            </div>

            {/* Texto de estado */}
            <div className="space-y-1 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">
                    Initializing System
                </p>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-40 italic">
                    Verifying Node Integrity
                </p>
            </div>

            {/* Inyectamos la animación sin usar el atributo jsx */}
            <style>
                {`
                @keyframes progress-slide {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(250%); }
                }
                .animate-progress-slide {
                    animation: progress-slide 1.5s infinite ease-in-out;
                }
                `}
            </style>
        </div>
    );
};