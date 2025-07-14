import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Informazioni Generali</h2>
            <p className="text-muted-foreground">
              La presente Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le vostre informazioni 
              personali quando visitate il sito web del Masjid As-Sunnah.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Titolare del Trattamento</h2>
            <div className="text-muted-foreground">
              <p><strong>Masjid As-Sunnah</strong></p>
              <p>Per contattarci: utilizzate la nostra <a href="/contattaci" className="text-primary hover:underline">pagina contatti</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Dati Raccolti</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Dati di Navigazione</h3>
                <p className="text-muted-foreground">
                  Durante la navigazione sul nostro sito, raccogliamo automaticamente alcuni dati tecnici come:
                  indirizzo IP, tipo di browser, sistema operativo, pagine visitate e durata della visita.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Dati di Contatto</h3>
                <p className="text-muted-foreground">
                  Se ci contattate attraverso il nostro modulo di contatto, raccoglieremo i dati che ci fornite 
                  volontariamente (nome, email, messaggio).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Finalità del Trattamento</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fornire e migliorare i nostri servizi</li>
              <li>Rispondere alle vostre richieste di informazioni</li>
              <li>Garantire la sicurezza del sito web</li>
              <li>Adempiere agli obblighi legali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Base Giuridica</h2>
            <p className="text-muted-foreground">
              Il trattamento dei vostri dati personali si basa sul legittimo interesse per il funzionamento del sito web 
              e, quando applicabile, sul vostro consenso esplicito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Conservazione dei Dati</h2>
            <p className="text-muted-foreground">
              I vostri dati personali verranno conservati solo per il tempo necessario al raggiungimento delle finalità 
              per cui sono stati raccolti, nel rispetto della normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">I Vostri Diritti</h2>
            <p className="text-muted-foreground mb-4">
              In conformità al GDPR, avete il diritto di:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Accedere ai vostri dati personali</li>
              <li>Richiedere la correzione di dati inesatti</li>
              <li>Richiedere la cancellazione dei vostri dati</li>
              <li>Limitare il trattamento dei vostri dati</li>
              <li>Opporvi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Sicurezza</h2>
            <p className="text-muted-foreground">
              Adottiamo misure tecniche e organizzative appropriate per proteggere i vostri dati personali 
              contro l'accesso non autorizzato, la perdita, la distruzione o la divulgazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifiche alla Privacy Policy</h2>
            <p className="text-muted-foreground">
              Questa Privacy Policy può essere aggiornata periodicamente. Vi informeremo di eventuali modifiche 
              significative pubblicando la nuova versione su questa pagina.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contatti</h2>
            <p className="text-muted-foreground">
              Per esercitare i vostri diritti o per qualsiasi domanda riguardante il trattamento dei vostri dati personali, 
              potete contattarci tramite la nostra <a href="/contattaci" className="text-primary hover:underline">pagina contatti</a>.
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