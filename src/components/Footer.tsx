import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-foreground">
            <span className="font-semibold">Masjid As-Sunnah</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>© {new Date().getFullYear()} Masjid As-Sunnah. Tutti i diritti riservati.</p>
            <p>Un luogo di adorazione, apprendimento e comunità</p>
          </div>
          <div className="text-xs text-muted-foreground/60">
            <p>Realizzato con 💚 per la comunità musulmana</p>
          </div>
        </div>
      </div>
    </footer>
  );
};