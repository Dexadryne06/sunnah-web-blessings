import { Heart } from "lucide-react";

export const Footer = ({ className = "" }: { className?: string }) => {
  return (
    <footer className={`bg-muted/50 border-t mt-16 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <span className="font-semibold">Masjid As-Sunnah</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Masjid As-Sunnah. Tutti i diritti riservati.</span>
            <span className="hidden md:inline">•</span>
            <span>Un luogo di adorazione, apprendimento e comunità</span>
          </div>
          <div className="text-xs text-muted-foreground/60">
            <span>Realizzato con 💚 da{" "}
              <a 
                href="mailto:admin@yusuf-ai.xyz" 
                className="underline hover:text-primary transition-colors"
              >
                Yusuf
              </a>
              {" "}per la comunità musulmana
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};