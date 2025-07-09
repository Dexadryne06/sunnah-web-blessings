import { Card, CardContent } from "@/components/ui/card";

export const ChiSiamo = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Chi Siamo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Masjid As-Sunnah è una comunità unita dalla fede, dedicata all'adorazione, 
            all'apprendimento e al servizio alla società.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                La Nostra Missione
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                La nostra missione è quella di fornire un luogo sacro e accogliente dove i musulmani 
                possano riunirsi per adorare Allah, apprendere gli insegnamenti dell'Islam e rafforzare 
                i legami di fratellanza. Ci impegniamo a seguire la Sunnah del Profeta Muhammad (pace e 
                benedizioni su di lui) in ogni aspetto della nostra vita comunitaria.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                I Nostri Valori
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Unità e Fratellanza</h3>
                  <p className="text-muted-foreground text-sm">
                    Crediamo nell'importanza dell'unità tra i musulmani, indipendentemente dalla loro 
                    origine o background culturale.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Conoscenza e Educazione</h3>
                  <p className="text-muted-foreground text-sm">
                    Promuoviamo l'apprendimento continuo del Corano, della Sunnah e delle scienze islamiche.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Servizio alla Comunità</h3>
                  <p className="text-muted-foreground text-sm">
                    Ci dedichiamo ad aiutare chi è nel bisogno e a contribuire positivamente alla società.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Accoglienza e Inclusione</h3>
                  <p className="text-muted-foreground text-sm">
                    Accogliamo tutti coloro che desiderano avvicinarsi all'Islam o approfondire la loro fede.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                La Nostra Storia
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Masjid As-Sunnah è stata fondata con l'obiettivo di creare uno spazio dove la comunità 
                musulmana locale potesse riunirsi per la preghiera, l'apprendimento e il sostegno reciproco. 
                Nel corso degli anni, siamo cresciuti come famiglia, accogliendo fedeli di diverse età e 
                background.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Oggi la nostra moschea non è solo un luogo di culto, ma un centro culturale e educativo 
                che organizza regolarmente lezioni, conferenze e attività comunitarie. Continuiamo a 
                lavorare per rafforzare i legami all'interno della nostra comunità e per essere un punto 
                di riferimento positivo nella società.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Le Nostre Attività
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Preghiere Quotidiane</h4>
                    <p className="text-sm text-muted-foreground">
                      Organizziamo le cinque preghiere quotidiane in congregazione
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Lezioni del Corano</h4>
                    <p className="text-sm text-muted-foreground">
                      Corsi di lettura, memorizzazione e interpretazione del Corano
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Educazione Islamica</h4>
                    <p className="text-sm text-muted-foreground">
                      Programmi educativi per bambini, giovani e adulti
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Supporto Comunitario</h4>
                    <p className="text-sm text-muted-foreground">
                      Assistenza a famiglie bisognose e nuovi convertiti
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};