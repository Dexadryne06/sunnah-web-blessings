import { Heart } from "lucide-react";

export const Footer = ({ className = "" }: { className?: string }) => {
  return (
    <footer className={`mt-8 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2 text-foreground whitespace-nowrap">
            <span className="font-semibold">Masjid As-Sunnah</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <span className="whitespace-nowrap">© {new Date().getFullYear()} Masjid As-Sunnah. Tutti i diritti riservati.</span>
          <span className="whitespace-nowrap">Un luogo di adorazione, apprendimento e comunità</span>
          <div className="flex gap-4 text-xs">
            <a href="/privacy-policy" className="hover:text-primary underline whitespace-nowrap">
              Privacy Policy
            </a>
            <a href="/cookie-policy" className="hover:text-primary underline whitespace-nowrap">
              Cookie Policy
            </a>
          </div>
          <div className="text-xs text-muted-foreground/60 whitespace-nowrap">
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