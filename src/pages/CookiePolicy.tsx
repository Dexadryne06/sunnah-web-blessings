import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cosa sono i Cookie</h2>
            <p className="text-muted-foreground">
              I cookie sono piccoli file di testo che vengono memorizzati sul vostro dispositivo quando visitate il nostro sito web. 
              Ci aiutano a fornire una migliore esperienza utente e a capire come viene utilizzato il nostro sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tipi di Cookie utilizzati</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Cookie Tecnici Necessari</h3>
                <p className="text-muted-foreground">
                  Questi cookie sono essenziali per il corretto funzionamento del sito web e non possono essere disattivati. 
                  Includono le preferenze del tema (modalità chiara/scura) e le impostazioni di navigazione.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Cookie di Funzionalità</h3>
                <p className="text-muted-foreground">
                  Questi cookie ci permettono di ricordare le vostre preferenze e di personalizzare la vostra esperienza sul nostro sito.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookie di Terze Parti</h2>
            <p className="text-muted-foreground">
              Attualmente non utilizziamo cookie di terze parti per scopi pubblicitari o di tracciamento. 
              Se dovessimo integrare servizi esterni in futuro, aggiorneremo questa policy di conseguenza.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Gestione dei Cookie</h2>
            <p className="text-muted-foreground">
              Potete gestire le vostre preferenze sui cookie attraverso le impostazioni del vostro browser. 
              Tuttavia, la disattivazione di alcuni cookie potrebbe influire sulla funzionalità del sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Aggiornamenti</h2>
            <p className="text-muted-foreground">
              Questa Cookie Policy può essere aggiornata periodicamente. Vi invitiamo a consultarla regolarmente per 
              rimanere informati sui nostri utilizzi dei cookie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contatti</h2>
            <p className="text-muted-foreground">
              Per qualsiasi domanda riguardante questa Cookie Policy, potete contattarci tramite la nostra 
              <a href="/contattaci" className="text-primary hover:underline ml-1">pagina contatti</a>.
            </p>
          </section>

          <div className="text-sm text-muted-foreground mt-8 pt-4 border-t">
            <p>Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};