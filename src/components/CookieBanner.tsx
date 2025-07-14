import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-md">
      <Card className="p-6 shadow-lg border-2">
        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              Utilizzo dei Cookie
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Utilizziamo cookie tecnici per migliorare la vostra esperienza di navigazione. 
              Continuando a navigare, accettate il loro utilizzo.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button 
                onClick={acceptCookies}
                size="sm"
                className="flex-1"
              >
                Accetta
              </Button>
              <Button 
                onClick={rejectCookies}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Rifiuta
              </Button>
            </div>
            <div className="mt-2">
              <a 
                href="/cookie-policy" 
                className="text-xs text-primary hover:underline"
              >
                Scopri di più sui cookie
              </a>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};